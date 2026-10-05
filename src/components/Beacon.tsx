"use client";

import { useEffect } from "react";

/**
 * Privacy-friendly analytics beacon — fires once per page load, sending the
 * path only. No cookies, no identifiers. See /api/analytics.
 */
export default function Beacon() {
  useEffect(() => {
    const payload = JSON.stringify({ p: window.location.pathname });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      } else {
        void fetch("/api/analytics", {
          method: "POST",
          body: payload,
          keepalive: true,
          headers: { "content-type": "application/json" },
        });
      }
    } catch {
      /* analytics must never break the page */
    }
  }, []);

  return null;
}
