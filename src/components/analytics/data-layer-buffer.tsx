"use client";

import { useEffect } from "react";

/**
 * Ensures `window.dataLayer` exists before GTM’s lazyOnload script runs.
 * No `<script>` tag in the React tree (React 19 rejects executable scripts
 * rendered from components).
 */
export function DataLayerBuffer() {
  useEffect(() => {
    const w = window as Window & { dataLayer?: unknown[] };
    if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
  }, []);

  return null;
}
