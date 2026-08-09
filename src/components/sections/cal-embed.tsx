"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export function CalEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#c9a15a" } },
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20">
      <div className="overflow-hidden rounded-2xl border border-border/70 shadow-sm">
        <Cal
          calLink={calLink}
          style={{ width: "100%", height: "650px", overflow: "scroll" }}
          config={{ layout: "month_view" }}
        />
      </div>
    </div>
  );
}
