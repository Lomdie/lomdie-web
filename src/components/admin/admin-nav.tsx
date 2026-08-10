"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  FileText,
  MessageSquareQuote,
  HelpCircle,
  Tag,
  Newspaper,
  UserCog,
  Users2,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout } from "@/lib/actions/auth";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  hint: string;
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    hint: "Vue d'ensemble de l'activité",
  },
  {
    href: "/admin/candidatures",
    label: "Candidatures",
    icon: Users,
    hint: "Toutes les personnes qui ont postulé sur le site",
  },
  {
    href: "/admin/rendez-vous",
    label: "Prospects",
    icon: CalendarClock,
    hint: "Suivre tous les prospects, avec ou sans appel découverte",
  },
  {
    href: "/admin/contenu",
    label: "Contenu du site",
    icon: FileText,
    hint: "Modifier les textes affichés sur les pages du site",
  },
  {
    href: "/admin/temoignages",
    label: "Témoignages",
    icon: MessageSquareQuote,
    hint: "Gérer les avis affichés sur la page Témoignages",
  },
  {
    href: "/admin/faq",
    label: "FAQ",
    icon: HelpCircle,
    hint: "Ajouter ou modifier les questions fréquentes",
  },
  {
    href: "/admin/offres",
    label: "Offres",
    icon: Tag,
    hint: "Modifier les formules et tarifs affichés",
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: Newspaper,
    hint: "Rédiger et publier des articles",
  },
  {
    href: "/admin/notre-equipe",
    label: "Notre équipe",
    icon: Users2,
    hint: "Photo, rôle et bio affichés sur la page À propos du site",
  },
  {
    href: "/admin/acces-admin",
    label: "Accès admin",
    icon: UserCog,
    hint: "Qui peut se connecter à cet espace pour gérer le site",
  },
];

export function AdminNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger
              render={
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  )}
                />
              }
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              {!collapsed && item.label}
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? item.label : item.hint}
            </TooltipContent>
          </Tooltip>
        );
      })}

      <div className="mt-auto pt-3">
        <form action={logout}>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                />
              }
            >
              <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              {!collapsed && "Se déconnecter"}
            </TooltipTrigger>
            <TooltipContent side="right">Se déconnecter</TooltipContent>
          </Tooltip>
        </form>
      </div>
    </nav>
  );
}
