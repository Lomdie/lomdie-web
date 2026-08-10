"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export function CalEmbed({
  calLink,
  name,
  email,
  notes,
}: {
  calLink: string;
  name?: string;
  email?: string;
  notes?: string;
}) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: true,
        layout: "month_view",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#BF7A18",
            "cal-brand-emphasis": "#A96512",
            "cal-brand-text": "#FFFDF8",
            "cal-brand-subtle": "#E8C88F",
            "cal-brand-accent": "#FFFDF8",
            "cal-text": "#49382D",
            "cal-text-emphasis": "#2F2119",
            "cal-text-subtle": "#746257",
            "cal-text-muted": "#A69488",
            "cal-bg": "#FDF8EE",
            "cal-bg-emphasis": "#F1E2C9",
            "cal-bg-subtle": "#F8EEDD",
            "cal-bg-muted": "#FBF4E8",
            "cal-bg-inverted": "#3A2517",
            "cal-border": "#E2D3BE",
            "cal-border-emphasis": "#BF7A18",
            "cal-border-subtle": "#E8DCCB",
            "cal-border-muted": "#F0E6D8",
            "cal-border-booker": "#E2D3BE",
            "cal-border-booker-width": "1px",
            radius: "0.5rem",
          },
          dark: {
            "cal-brand": "#BF7A18",
            "cal-brand-emphasis": "#A96512",
            "cal-brand-text": "#FFFDF8",
            "cal-brand-subtle": "#E8C88F",
            "cal-brand-accent": "#FFFDF8",
            "cal-text": "#49382D",
            "cal-text-emphasis": "#2F2119",
            "cal-text-subtle": "#746257",
            "cal-text-muted": "#A69488",
            "cal-bg": "#FDF8EE",
            "cal-bg-emphasis": "#F1E2C9",
            "cal-bg-subtle": "#F8EEDD",
            "cal-bg-muted": "#FBF4E8",
            "cal-bg-inverted": "#3A2517",
            "cal-border": "#E2D3BE",
            "cal-border-emphasis": "#BF7A18",
            "cal-border-subtle": "#E8DCCB",
            "cal-border-muted": "#F0E6D8",
            "cal-border-booker": "#E2D3BE",
            "cal-border-booker-width": "1px",
            radius: "0.5rem",
          },
        },
      });
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20">
      <div className="overflow-hidden rounded-2xl border border-border/70 shadow-sm">
        <Cal
          calLink={calLink}
          style={{ width: "100%", height: "650px", overflow: "scroll" }}
          config={{
            layout: "month_view",
            theme: "light",
            ...(name ? { name } : {}),
            ...(email ? { email } : {}),
            ...(notes ? { notes } : {}),
          }}
        />
      </div>
    </div>
  );
}
