"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminBrand } from "@/components/admin/admin-brand";

export function AdminTopbar({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/70 bg-card px-4 lg:hidden">
      <Link href="/admin" aria-label="Accueil de l’espace équipe Lomdie">
        <AdminBrand className="w-28" />
      </Link>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {userEmail}
        </span>
        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border/70">
              <SheetTitle className="flex items-center">
                <AdminBrand className="w-28" />
              </SheetTitle>
            </SheetHeader>
            <div onClick={() => setOpen(false)}>
              <AdminNav />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
