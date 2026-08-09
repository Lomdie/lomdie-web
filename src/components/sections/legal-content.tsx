import { getSiteContent } from "@/lib/site-content";
import { sanitizeContentHtml } from "@/lib/sanitize-html";

const fallback =
  "<p>Cette page est en cours de finalisation avec notre équipe juridique. Pour toute question en attendant, contactez-nous directement à contact@lomdie.com.</p>";

export async function LegalContent({
  title,
  contentKey,
}: {
  title: string;
  contentKey: string;
}) {
  const content = await getSiteContent([contentKey]);
  const html = await sanitizeContentHtml(content[contentKey] || fallback);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="font-display text-3xl">{title}</h1>
        <div
          className="blog-content mt-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
