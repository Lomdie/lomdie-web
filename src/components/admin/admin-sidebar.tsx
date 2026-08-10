"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";

const STORAGE_KEY = "lomdie-admin-sidebar-collapsed";

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-border/70 bg-secondary/40 transition-[width] duration-200 lg:flex lg:flex-col",
        hydrated ? (collapsed ? "w-[72px]" : "w-64") : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border/70 px-5">
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          <Heart className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
          {!collapsed && <span className="font-display text-lg whitespace-nowrap">Lomdie</span>}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AdminNav collapsed={collapsed} />
      </div>

      <div className="border-t border-border/70 px-3 py-3">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="whitespace-nowrap">Replier</span>
            </>
          )}
        </button>
        {!collapsed && (
          <p className="mt-2 truncate px-3 text-xs text-muted-foreground">{userEmail}</p>
        )}
      </div>
    </aside>
  );
}
