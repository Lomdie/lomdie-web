import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { createAuthedServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    default: "Espace équipe",
    template: "%s — Espace équipe Lomdie",
  },
};

// L'admin est entierement dynamique et personnalise (authentification requise) :
// aucun interet a le pre-rendre statiquement.
export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createAuthedServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return children;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-white">
      <AdminSidebar userEmail={user.email ?? ""} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar userEmail={user.email ?? ""} />
        <main className="min-w-0 flex-1 overflow-x-hidden bg-white p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
