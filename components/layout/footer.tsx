import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="font-serif text-xl font-semibold tracking-widest">
              QUINTESS
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              La plateforme de référence pour une mise en relation d'exception
              entre clients exigeants et professionnels du luxe.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Plateforme
            </p>
            <ul className="space-y-2">
              {[
                { label: "Nos expertises", href: "/#categories" },
                { label: "Comment ça marche", href: "/#process" },
                { label: "Connexion", href: "/connexion" },
                { label: "Inscription", href: "/inscription" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Contact
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                contact@quintess.fr
              </li>
              <li className="text-sm text-muted-foreground">
                +33 1 23 45 67 89
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Quintess. Tous droits réservés.</p>
          <p className="tracking-widest">DISCRÉTION · EXCELLENCE · CONFIANCE</p>
        </div>
      </div>
    </footer>
  );
}
