import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";

export async function Header() {
  const session = await getSession();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-semibold tracking-widest text-foreground">
            QUINTESS
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#categories"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Nos expertises
          </Link>
          <Link
            href="/#process"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Comment ça marche
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href={session.role === "ADMIN" ? "/admin" : "/dashboard"}>
                  Mon espace
                </Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/connexion">Connexion</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/inscription">Commencer</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
