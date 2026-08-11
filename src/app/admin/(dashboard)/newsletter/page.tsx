import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { createAuthedServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Newsletter" };

interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export default async function NewsletterAdminPage() {
  const supabase = await createAuthedServerClient();
  const { data, error, count } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  const subscribers = (data ?? []) as NewsletterSubscriber[];
  const subscriberCount = count ?? subscribers.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Newsletter</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {subscriberCount} adresse{subscriberCount === 1 ? "" : "s"} collectée{subscriberCount === 1 ? "" : "s"} depuis la homepage.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          Impossible de charger les inscriptions à la newsletter.
        </div>
      ) : subscribers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <Mail className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">Aucune adresse e-mail collectée pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left">
              <tr>
                <th className="p-4 font-medium">Adresse e-mail</th>
                <th className="p-4 font-medium">Date d’inscription</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-border/70 last:border-0">
                  <td className="p-4 font-medium">{subscriber.email}</td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(subscriber.created_at).toLocaleString("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Europe/Paris",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
