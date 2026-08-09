export const instant = false;

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-6">
      {children}
    </div>
  );
}
