import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8">
        <span className="font-serif text-2xl font-semibold tracking-widest text-foreground">
          QUINTESS
        </span>
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Discrétion · Excellence · Confiance
      </p>
    </div>
  );
}
