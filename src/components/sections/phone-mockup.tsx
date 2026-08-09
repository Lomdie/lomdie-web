import { Heart, X } from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="mx-auto w-44 shrink-0 sm:w-48">
      <div className="rounded-[2rem] border-4 border-ink/80 bg-background p-2 shadow-lg">
        <div className="overflow-hidden rounded-[1.5rem] bg-secondary/40">
          <div className="flex items-center justify-between px-4 pb-1.5 pt-3 text-[10px] text-muted-foreground">
            <span>9:41</span>
            <span className="h-2 w-8 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="relative mx-3 mb-4 aspect-3/4 overflow-hidden rounded-xl bg-secondary">
            <div className="absolute inset-3 rounded-lg bg-secondary-foreground/10" />
            <div className="absolute inset-6 rounded-lg bg-secondary-foreground/15" />
          </div>

          <div className="flex items-center justify-center gap-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-destructive/40 text-destructive/70">
              <X className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-primary/70">
              <Heart className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
