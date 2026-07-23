"use client";

import { useEffect } from "react";

export default function ScrollToPricing() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("scrollTo")) {
      const el = document.getElementById(params.get("scrollTo")!);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const url = new URL(window.location.href);
      url.searchParams.delete("scrollTo");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return null;
}
