import type { Metadata } from "next";
import { ContentFieldForm } from "@/components/admin/content-field-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { HelpTooltip } from "@/components/admin/help-tooltip";

export const metadata: Metadata = { title: "Contenu du site" };

async function getContentByPage() {
  const supabase = await createAuthedServerClient();
  const { data } = await supabase
    .from("site_content")
    .select("key, label, value, content_type, page")
    .order("page")
    .order("key");

  const grouped = new Map<
    string,
    { key: string; label: string; value: string; content_type: string }[]
  >();

  for (const row of data ?? []) {
    const list = grouped.get(row.page) ?? [];
    list.push(row);
    grouped.set(row.page, list);
  }

  return grouped;
}

export default async function AdminContenuPage() {
  const grouped = await getContentByPage();
  const pages = Array.from(grouped.keys());

  if (pages.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center text-sm text-muted-foreground">
        Aucun texte éditable enregistré pour le moment.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl">
          Contenu du site
          <HelpTooltip text="Chaque onglet correspond à une page du site. Modifiez un texte puis cliquez sur son bouton « Enregistrer » : le changement est visible immédiatement sur la page publique correspondante, sans rien recompiler." />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Modifiez les textes affichés sur les pages publiques. Chaque champ
          s&apos;enregistre indépendamment.
        </p>
      </div>

      <Tabs defaultValue={pages[0]}>
        <TabsList>
          {pages.map((page) => (
            <TabsTrigger key={page} value={page}>
              {page}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map((page) => (
          <TabsContent key={page} value={page} className="space-y-4">
            {grouped.get(page)!.map((field) => (
              <ContentFieldForm
                key={field.key}
                fieldKey={field.key}
                label={field.label}
                value={field.value}
                contentType={field.content_type}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
