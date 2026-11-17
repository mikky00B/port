"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Route = "" | "work" | "writing" | "me" | "contact";

const VALID: Route[] = ["", "work", "writing", "me", "contact"];

function parse(): Route {
  if (typeof window === "undefined") return "";
  const h = window.location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
  return (VALID as string[]).includes(h) ? (h as Route) : "";
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function getServerSnapshot(): Route {
  return "";
}

export function useHashRoute() {
  const route = useSyncExternalStore(subscribe, parse, getServerSnapshot);

  const navigate = useCallback((r: Route) => {
    if (r === "") {
      const h = window.location.hash;
      if (h === "" || h === "#" || h === "#/") {
        // already home — force re-render for consistency
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      } else {
        window.location.hash = "/";
      }
    } else if (window.location.hash !== `#/${r}`) {
      window.location.hash = `/${r}`;
    } else {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, []);

  return { route, navigate };
}
