# Azure VM Deployment Guide

This guide explains how to deploy this Next.js portfolio to an Azure Virtual Machine and set up GitHub Actions so every push to GitHub automatically updates the live site.

The setup uses:

- Ubuntu Linux on Azure VM
- Node.js
- PM2 to keep the Next.js app running
- Nginx as a reverse proxy
- Certbot for HTTPS
- GitHub Actions for automatic deployment

## 1. Expected Production Flow

The final setup will work like this:

```txt
You push code to GitHub
        |
GitHub Actions runs lint/build checks
        |
GitHub Actions SSHs into the Azure VM
        |
VM pulls latest code from GitHub
        |
VM installs dependencies, builds Next.js, restarts PM2
        |
Nginx serves the updated site through your domain
```

## 2. Create The Azure VM

In the Azure portal:

1. Create a new Virtual Machine.
2. Choose Ubuntu Server LTS.
3. Choose a small VM size to start. A `B1s` or `B2s` is usually enough for a personal portfolio.
4. Enable SSH access.
5. Add your SSH public key.
6. Open these inbound ports:

```txt
22   SSH
80   HTTP
443  HTTPS
```

After creating the VM, note:

```txt
VM public IP address
VM username
```

Example:

```txt
IP: 20.50.100.10
User: azureuser
```

## 3. Connect To The VM

From your local machine:

```bash
ssh azureuser@YOUR_VM_PUBLIC_IP
```

Example:

```bash
ssh azureuser@20.50.100.10
```

## 4. Install Server Dependencies

Update the VM:

```bash
sudo apt update
sudo apt upgrade -y
```

Install basic tools:

```bash
sudo apt install -y git curl nginx
```

Install Node.js LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

Check versions:

```bash
node -v
npm -v
```

Install PM2 globally:

```bash
sudo npm install -g pm2
```

## 5. Clone The Project On The VM

Choose an app directory:

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
```

Clone your GitHub repository:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git clevermike
cd clevermike
```

Example:

```bash
git clone https://github.com/mikky00B/clevermike.git clevermike
cd clevermike
```

Install dependencies:

```bash
npm ci
```

Build the app:

```bash
npm run build
```

Start it with PM2:

```bash
pm2 start npm --name clevermike -- start -- -p 3000
```

Save the PM2 process list:

```bash
pm2 save
```

Make PM2 restart apps after VM reboot:

```bash
pm2 startup systemd
```

PM2 will print a command that starts with `sudo env PATH=...`. Copy and run that command.

Check the app:

```bash
pm2 status
curl http://localhost:3000
```

## 6. Configure Nginx

Create an Nginx config:

```bash
sudo nano /etc/nginx/sites-available/clevermike
```

Paste this:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Replace:

```txt
YOUR_DOMAIN.com
```

with your real domain.

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/clevermike /etc/nginx/sites-enabled/clevermike
```

Remove the default Nginx site if it exists:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

Test Nginx:

```bash
sudo nginx -t
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

At this point, visiting your domain should show the app if DNS is already pointed at the VM.

## 7. Point Your Domain To The VM

In your domain provider DNS settings, create these records:

```txt
Type: A
Name: @
Value: YOUR_VM_PUBLIC_IP
```

Optional `www` record:

```txt
Type: A
Name: www
Value: YOUR_VM_PUBLIC_IP
```

DNS can take a few minutes to a few hours to fully update.

## 8. Add HTTPS With Certbot

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Run Certbot:

```bash
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

Follow the prompts.

Test renewal:

```bash
sudo certbot renew --dry-run
```

## 9. Prepare GitHub Access On The VM

For automatic deployment, the VM must be able to pull from GitHub.

If the GitHub repo is public, HTTPS clone is enough.

If the GitHub repo is private, use an SSH deploy key.

On the VM:

```bash
ssh-keygen -t ed25519 -C "azure-vm-clevermike-deploy"
```

Press Enter for the default path.

Show the public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

In GitHub:

1. Open your repository.
2. Go to `Settings`.
3. Go to `Deploy keys`.
4. Click `Add deploy key`.
5. Paste the public key.
6. Give it a name like `Azure VM Deploy Key`.
7. Do not enable write access unless you specifically need it.

If using SSH, update the VM repo remote:

```bash
cd /var/www/clevermike
git remote set-url origin git@github.com:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
```

Test:

```bash
git pull
```

## 10. Create A Deployment Script On The VM

Create a deploy script:

```bash
nano /var/www/clevermike/deploy.sh
```

Paste this:

```bash
#!/usr/bin/env bash
set -e

cd /var/www/clevermike

git fetch origin
git reset --hard origin/main

npm ci
npm run build

pm2 restart clevermike
pm2 save
```

Make it executable:

```bash
chmod +x /var/www/clevermike/deploy.sh
```

Test it manually:

```bash
/var/www/clevermike/deploy.sh
```

If your default branch is not `main`, change this line:

```bash
git reset --hard origin/main
```

Example for `master`:

```bash
git reset --hard origin/master
```

## 11. Create A GitHub Actions SSH Key

GitHub Actions needs SSH access to the VM.

On your local machine, create a dedicated key:

```bash
ssh-keygen -t ed25519 -C "github-actions-clevermike-deploy" -f ./github-actions-clevermike
```

This creates:

```txt
github-actions-clevermike
github-actions-clevermike.pub
```

Copy the public key:

```bash
cat github-actions-clevermike.pub
```

On the VM, open authorized keys:

```bash
nano ~/.ssh/authorized_keys
```

Paste the public key on a new line.

Now copy the private key:

```bash
cat github-actions-clevermike
```

You will add this private key to GitHub Secrets.

## 12. Add GitHub Repository Secrets

In GitHub:

1. Open your repository.
2. Go to `Settings`.
3. Go to `Secrets and variables`.
4. Go to `Actions`.
5. Add these repository secrets:

```txt
AZURE_VM_HOST       your VM public IP or domain
AZURE_VM_USER       your VM username, example azureuser
AZURE_VM_SSH_KEY    private key from github-actions-clevermike
```

Optional:

```txt
AZURE_VM_PORT       22
```

If you do not add `AZURE_VM_PORT`, the workflow below uses port `22`.

## 13. Add The GitHub Actions Workflow

Create this file in the repo:

```txt
.github/workflows/deploy.yml
```

Use this workflow:

```yaml
name: Deploy to Azure VM

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Build app
        run: npm run build

      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.AZURE_VM_HOST }}
          username: ${{ secrets.AZURE_VM_USER }}
          key: ${{ secrets.AZURE_VM_SSH_KEY }}
          port: ${{ secrets.AZURE_VM_PORT || 22 }}
          script: |
            /var/www/clevermike/deploy.sh
```

If your deployment branch is not `main`, change:

```yaml
branches:
  - main
```

to your actual branch.

## 14. First Deployment Test

Commit and push the workflow:

```bash
git add AZURE_VM_DEPLOYMENT.md .github/workflows/deploy.yml
git commit -m "Add Azure VM deployment workflow"
git push origin main
```

Then check:

1. GitHub repository.
2. `Actions` tab.
3. Open the latest workflow run.
4. Confirm all steps pass.

On the VM, you can check the app:

```bash
pm2 status
pm2 logs clevermike
```

## 15. Useful Server Commands

Check app status:

```bash
pm2 status
```

View logs:

```bash
pm2 logs clevermike
```

Restart app:

```bash
pm2 restart clevermike
```

Check Nginx:

```bash
sudo systemctl status nginx
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

Test Nginx config:

```bash
sudo nginx -t
```

Check open ports:

```bash
sudo ss -tulpn
```

## 16. Common Problems

### GitHub Actions Cannot SSH Into The VM

Check:

- The VM public IP is correct.
- Port `22` is open in Azure Network Security Group.
- `AZURE_VM_USER` is correct.
- `AZURE_VM_SSH_KEY` contains the private key, not the public key.
- The matching public key is in `~/.ssh/authorized_keys` on the VM.

### Nginx Shows 502 Bad Gateway

Check if the Next.js app is running:

```bash
pm2 status
pm2 logs clevermike
curl http://localhost:3000
```

If the app is stopped:

```bash
cd /var/www/clevermike
pm2 start npm --name clevermike -- start -- -p 3000
pm2 save
```

### Deployment Pulls The Wrong Branch

Check the branch in:

```bash
/var/www/clevermike/deploy.sh
```

Make sure it matches your GitHub default branch.

### Build Fails On The VM But Works Locally

Run:

```bash
node -v
npm -v
```

Use a current Node.js LTS version. This project is a modern Next.js app, so old Node versions can fail.

## 17. Security Notes

- Do not expose port `3000` publicly. Nginx should be the public entry point.
- Keep only `22`, `80`, and `443` open in Azure.
- Use SSH keys, not password login.
- Keep your GitHub Actions deploy key separate from your personal SSH key.
- Do not commit `.env` files or private keys.
- If you later add environment variables, store them on the VM or in GitHub Secrets.

## 18. Optional Improvement: Zero-Downtime Style Deploy

For a personal portfolio, restarting PM2 after build is fine.

If the site grows, you can improve deployment by:

- Building in a separate release directory.
- Switching a symlink after build succeeds.
- Restarting PM2 only after the new build is ready.
- Keeping the previous release for rollback.

The current setup is simpler and good enough for this portfolio.
