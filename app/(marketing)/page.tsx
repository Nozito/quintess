export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Building2,
  Car,
  UtensilsCrossed,
  Sparkles,
  Flower2,
  ShoppingBag,
  Star,
  Plane,
  ArrowRight,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import db from "@/lib/db";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Building2,
  Car,
  UtensilsCrossed,
  Sparkles,
  Flower2,
  ShoppingBag,
  Star,
  Plane,
};

const STATIC_CATEGORIES = [
  { id: "1", name: "Hôtellerie de luxe", slug: "hotellerie-luxe", description: "Palaces, hôtels 5 étoiles et suites privées", icon: "Building2", order: 1 },
  { id: "2", name: "Chauffeur privé", slug: "chauffeur-prive", description: "Transferts VIP et mise à disposition", icon: "Car", order: 2 },
  { id: "3", name: "Restauration premium", slug: "restauration-premium", description: "Tables étoilées et chefs privés", icon: "UtensilsCrossed", order: 3 },
  { id: "4", name: "Événementiel privé", slug: "evenementiel-prive", description: "Organisation d'événements exclusifs", icon: "Sparkles", order: 4 },
  { id: "5", name: "Bien-être & Spa", slug: "bien-etre-spa", description: "Soins premium et retraites wellness", icon: "Flower2", order: 5 },
  { id: "6", name: "Shopping & Personal Shopper", slug: "personal-shopper", description: "Accompagnement shopping luxe", icon: "ShoppingBag", order: 6 },
  { id: "7", name: "Expériences exclusives", slug: "experiences-exclusives", description: "Aventures uniques et accès privés", icon: "Star", order: 7 },
  { id: "8", name: "Travel Planning", slug: "travel-planning", description: "Voyages sur-mesure et itinéraires premium", icon: "Plane", order: 8 },
];

export default async function HomePage() {
  let categories = STATIC_CATEGORIES;
  try {
    const dbCategories = await db.category.findMany({ orderBy: { order: "asc" } });
    if (dbCategories.length > 0) categories = dbCategories;
  } catch {
    // fallback sur les catégories statiques si DB indisponible
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-foreground px-4 pt-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/80 via-foreground to-black opacity-90" />
        <div className="relative z-10 max-w-3xl animate-fade-in">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Conciergerie d'exception
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
            Votre vie mérite
            <br />
            <span className="text-gold">l'excellence.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            Quintess connecte vos exigences à des professionnels d'exception,
            sélectionnés pour leur savoir-faire, leur discrétion
            et leur excellence.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="gold" className="min-w-48 text-sm tracking-widest">
              <Link href="/inscription">Exprimer un besoin</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="min-w-48 border border-white/20 text-white hover:bg-white/10 hover:text-white text-sm tracking-widest">
              <Link href="/connexion">Se connecter</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-6 w-px bg-white/30" />
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { value: "200+", label: "Partenaires certifiés" },
              { value: "98%", label: "Taux de satisfaction" },
              { value: "24h", label: "Délai de réponse garanti" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 text-center first:pl-0 last:pr-0 md:px-12">
                <p className="font-serif text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              Nos expertises
            </p>
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">
              Un savoir-faire d'exception
              <br />
              dans chaque domaine
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] ?? Star;
              return (
                <Link
                  key={cat.id}
                  href="/inscription"
                  className="group flex flex-col items-center rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-gold/40 hover:shadow-md"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-gold/10">
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-gold" />
                  </div>
                  <p className="text-sm font-medium leading-tight">{cat.name}</p>
                  {cat.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-muted/40 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              Notre approche
            </p>
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">
              Trois étapes vers
              <br />
              l'expérience idéale
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Users,
                title: "Exprimez votre besoin",
                description:
                  "Décrivez votre besoin en quelques minutes grâce à notre formulaire structuré. Budget, lieu, date, niveau d'exigence.",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "Recommandation intelligente",
                description:
                  "Notre algorithme analyse votre demande et sélectionne les partenaires les mieux adaptés parmi notre réseau certifié.",
              },
              {
                step: "03",
                icon: Shield,
                title: "Suivi en temps réel",
                description:
                  "Notre équipe de conciergerie pilote votre demande de bout en bout et vous tient informé à chaque étape.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative flex flex-col">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-serif text-3xl font-semibold text-gold/40">
                      {item.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                      <Icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: Shield, title: "Partenaires certifiés", description: "Chaque professionnel est vérifié, évalué et sélectionné selon des critères d'excellence stricts." },
              { icon: Clock, title: "Réactivité garantie", description: "Notre équipe traite chaque demande sous 24h et vous accompagne tout au long du processus." },
              { icon: Users, title: "Discrétion absolue", description: "Confidentialité totale de vos données et de vos demandes. Votre vie privée est notre priorité." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-border bg-card p-6">
                  <Icon className="mb-3 h-5 w-5 text-gold" />
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-white md:text-4xl">
            Prêt à vivre une expérience
            <br />
            <span className="text-gold">hors du commun ?</span>
          </h2>
          <p className="mt-4 text-white/70">
            Rejoignez les clients qui font confiance à Quintess pour chacune de leurs exigences.
          </p>
          <Button asChild size="lg" variant="gold" className="mt-8 min-w-48 text-sm tracking-widest">
            <Link href="/inscription">
              Créer mon espace Quintess
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
