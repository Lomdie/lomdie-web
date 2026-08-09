interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b border-border/70 bg-secondary/30">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
