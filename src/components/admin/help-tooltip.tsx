"use client";

import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function HelpTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        closeOnClick={false}
        render={
          <button
            type="button"
            aria-label="Aide sur cette page"
            className="text-muted-foreground transition-colors hover:text-primary"
          />
        }
      >
        <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs text-left">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
