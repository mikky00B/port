
# Project Working Agreement

## General
- Follow the existing architecture and coding conventions.
- Inspect relevant code before making changes.
- Avoid unnecessary dependencies and unrelated refactoring.
- Run the appropriate tests and checks before reporting completion.
- Never claim a test passed unless it was actually executed.

## Developer responsibilities
- Implement only the requested task and necessary supporting changes.
- Add or update tests for changed behavior.
- Run the relevant checks.
- Summarize changed files, implementation decisions, and test results in HANDOFF.md.
- Do not modify REVIEW.md to mark your own work as approved.

## Reviewer responsibilities
- Review the actual Git diff and relevant surrounding code.
- Verify behavior, edge cases, regressions, security, and maintainability.
- Run relevant tests when practical.
- Report actionable findings with severity, file paths, and line references.
- Distinguish confirmed bugs from suggestions and uncertainties.
- Do not modify implementation files during a review.
- Write the review outcome only to REVIEW.md.

## Review outcomes
- PASS: No unresolved material defects found.
- CHANGES_REQUESTED: One or more actionable defects remain.
- NEEDS_HUMAN: Important uncertainty requires a human decision.

## Fix cycle
- The developer addresses valid findings and records what changed.
- The reviewer checks the updated diff and verifies each finding.
- Repeat until PASS or NEEDS_HUMAN.
- Do not suppress legitimate findings merely to reach PASS.
