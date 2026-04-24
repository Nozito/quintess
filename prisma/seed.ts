import { PrismaClient, BudgetRange, PartnerStatus, RequestStatus, UrgencyLevel, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Quintess database...");

  await db.message.deleteMany();
  await db.requestUpdate.deleteMany();
  await db.recommendation.deleteMany();
  await db.conciergeRequest.deleteMany();
  await db.partnerProfile.deleteMany();
  await db.clientProfile.deleteMany();
  await db.category.deleteMany();
  await db.user.deleteMany();

  // ─── Categories ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    db.category.create({ data: { name: "Hôtellerie de luxe", slug: "hotellerie-luxe", description: "Palaces, hôtels 5 étoiles et suites privées", icon: "Building2", order: 1 } }),
    db.category.create({ data: { name: "Chauffeur privé", slug: "chauffeur-prive", description: "Transferts VIP et mise à disposition avec chauffeur", icon: "Car", order: 2 } }),
    db.category.create({ data: { name: "Restauration premium", slug: "restauration-premium", description: "Tables étoilées, chefs privés et gastronomie sur-mesure", icon: "UtensilsCrossed", order: 3 } }),
    db.category.create({ data: { name: "Événementiel privé", slug: "evenementiel-prive", description: "Organisation d'événements exclusifs et réceptions privées", icon: "Sparkles", order: 4 } }),
    db.category.create({ data: { name: "Bien-être & Spa", slug: "bien-etre-spa", description: "Soins premium, massages et retraites wellness", icon: "Flower2", order: 5 } }),
    db.category.create({ data: { name: "Shopping & Personal Shopper", slug: "personal-shopper", description: "Accompagnement shopping luxe et conseil stylistique", icon: "ShoppingBag", order: 6 } }),
    db.category.create({ data: { name: "Expériences exclusives", slug: "experiences-exclusives", description: "Aventures uniques, accès privés et moments d'exception", icon: "Star", order: 7 } }),
    db.category.create({ data: { name: "Travel Planning", slug: "travel-planning", description: "Organisation de voyages sur-mesure et itinéraires premium", icon: "Plane", order: 8 } }),
  ]);

  const [hotellerie, chauffeur, restauration, evenementiel, bienetre, shopping, experiences, travel] = categories;

  // ─── Admin ────────────────────────────────────────────────────────────────
  const adminUser = await db.user.create({
    data: {
      email: "admin@quintess.fr",
      name: "Admin Quintess",
      password: await bcrypt.hash("Admin1234!", 12),
      role: Role.ADMIN,
    },
  });

  // ─── Clients ──────────────────────────────────────────────────────────────
  const client1 = await db.user.create({
    data: {
      email: "sophie.leclerc@email.fr",
      name: "Sophie Leclerc",
      password: await bcrypt.hash("Client1234!", 12),
      role: Role.CLIENT,
      clientProfile: {
        create: { phone: "+33 6 12 34 56 78", city: "Paris", onboarded: true },
      },
    },
    include: { clientProfile: true },
  });

  const client2 = await db.user.create({
    data: {
      email: "antoine.beaumont@email.fr",
      name: "Antoine Beaumont",
      password: await bcrypt.hash("Client1234!", 12),
      role: Role.CLIENT,
      clientProfile: {
        create: { phone: "+33 6 98 76 54 32", city: "Lyon", onboarded: true },
      },
    },
    include: { clientProfile: true },
  });

  const client3 = await db.user.create({
    data: {
      email: "marie.renard@email.fr",
      name: "Marie Renard",
      password: await bcrypt.hash("Client1234!", 12),
      role: Role.CLIENT,
      clientProfile: {
        create: { city: "Nice", onboarded: false },
      },
    },
    include: { clientProfile: true },
  });

  // ─── Partners ─────────────────────────────────────────────────────────────
  const partnerUsers = await Promise.all([
    // Hôtellerie
    db.user.create({
      data: {
        email: "contact@palaisroyal-paris.fr",
        name: "Palais Royal Suites",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Palais Royal Suites",
            shortBio: "Suites privées d'exception au cœur du 1er arrondissement",
            description: "Palais Royal Suites propose une collection de résidences privées et de suites meublées avec des pièces uniques, à deux pas des Tuileries. Un accueil personnalisé, une conciergerie 24h/24 et des services hôteliers de palace font de chaque séjour une expérience mémorable.",
            city: "Paris",
            zone: "Île-de-France",
            categoryId: hotellerie.id,
            budgetRange: BudgetRange.ULTRA_LUXE,
            services: ["Suites privées", "Conciergerie 24/7", "Service de chambre gastronomique", "Transferts aéroport", "Garde-robe sur-mesure"],
            availability: "Sur réservation, disponibilité à confirmer sous 24h",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-01-15"),
            rating: 4.9,
            reviewCount: 47,
            imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
            tags: ["Palace", "Suites", "Paris", "Discrétion", "Luxe extrême"],
          },
        },
      },
    }),
    // Chauffeur
    db.user.create({
      data: {
        email: "contact@elitedrive-paris.fr",
        name: "Elite Drive Paris",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Elite Drive Paris",
            shortBio: "Flotte de véhicules de prestige, chauffeurs certifiés discrétion absolue",
            description: "Elite Drive Paris met à votre disposition une flotte exclusive de Bentley, Rolls-Royce et Mercedes Classe S avec chauffeurs privés en livrée. Prise en charge à domicile, aéroports, événements. Service disponible 24h/24.",
            city: "Paris",
            zone: "Île-de-France",
            categoryId: chauffeur.id,
            budgetRange: BudgetRange.LUXE,
            services: ["Mise à disposition", "Transferts aéroports", "Soirées privées", "Voyages longue distance", "Mariages et cérémonies"],
            availability: "Disponible 7j/7, 24h/24 sur réservation",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-02-10"),
            rating: 4.8,
            reviewCount: 132,
            imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            tags: ["Rolls-Royce", "Bentley", "Paris", "VIP", "Discret"],
          },
        },
      },
    }),
    // Restauration
    db.user.create({
      data: {
        email: "contact@chef-pierre.fr",
        name: "Chef Pierre Armand",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Pierre Armand — Chef Privé",
            shortBio: "Chef étoilé pour dîners privés et événements gastronomiques",
            description: "Ancien chef deux étoiles Michelin, Pierre Armand réalise des dîners privés d'exception dans votre résidence ou dans des lieux partenaires. Menus entièrement conçus sur-mesure, accords mets-vins, service en salle inclus.",
            city: "Paris",
            zone: "Île-de-France",
            categoryId: restauration.id,
            budgetRange: BudgetRange.ULTRA_LUXE,
            services: ["Dîners privés", "Buffets gastronomiques", "Ateliers cuisine", "Accords mets-vins", "Chef résident"],
            availability: "Réservation minimum 72h à l'avance",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-01-20"),
            rating: 5.0,
            reviewCount: 28,
            imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
            tags: ["Chef étoilé", "Gastronomie", "Dîner privé", "Michelin"],
          },
        },
      },
    }),
    // Restauration Lyon
    db.user.create({
      data: {
        email: "contact@table-privee-lyon.fr",
        name: "La Table Privée",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "La Table Privée — Lyon",
            shortBio: "Restaurant privatisable et chef à domicile, Lyon et région",
            description: "Restaurant gastronomique entièrement privatisable pour vos dîners d'affaires et soirées intimes. Notre chef propose également des prestations à domicile sur toute la région lyonnaise. Sélection de grands crus et carte des vins d'exception.",
            city: "Lyon",
            zone: "Auvergne-Rhône-Alpes",
            categoryId: restauration.id,
            budgetRange: BudgetRange.LUXE,
            services: ["Privatisation restaurant", "Chef à domicile", "Déjeuners d'affaires", "Cave à vins", "Traiteur premium"],
            availability: "Sur réservation, 48h minimum",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-03-01"),
            rating: 4.7,
            reviewCount: 64,
            imageUrl: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800",
            tags: ["Lyon", "Gastronomie", "Privatisation", "Vins"],
          },
        },
      },
    }),
    // Événementiel
    db.user.create({
      data: {
        email: "contact@atelier-evenements.fr",
        name: "Atelier Événements",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Atelier Événements",
            shortBio: "Conception et réalisation d'événements privés d'exception",
            description: "Atelier Événements orchestre vos soirées privées, anniversaires, mariages et réceptions avec une attention portée à chaque détail. Décoration florale sur-mesure, coordination complète, accès à notre réseau exclusif de prestataires partenaires.",
            city: "Paris",
            zone: "Île-de-France",
            categoryId: evenementiel.id,
            budgetRange: BudgetRange.LUXE,
            services: ["Soirées privées", "Mariages", "Anniversaires", "Séminaires VIP", "Décoration florale", "Animation"],
            availability: "Consultation initiale sous 48h",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-02-15"),
            rating: 4.8,
            reviewCount: 89,
            imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
            tags: ["Événementiel", "Mariage", "Réception", "Paris", "Luxe"],
          },
        },
      },
    }),
    // Bien-être
    db.user.create({
      data: {
        email: "contact@quintessence-spa.fr",
        name: "Quintessence Spa",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Quintessence Spa & Wellness",
            shortBio: "Institut de soins premium et massages à domicile ou en suite",
            description: "Quintessence Spa propose des soins du corps et du visage d'exception, réalisés par des thérapeutes certifiés. Interventions à domicile, en hôtel ou dans notre espace dédié. Protocoles exclusifs aux huiles précieuses, soins sur-mesure et rituels de bien-être.",
            city: "Paris",
            zone: "Île-de-France",
            categoryId: bienetre.id,
            budgetRange: BudgetRange.PREMIUM,
            services: ["Massages à domicile", "Soins visage", "Rituels corps", "Hammam privatif", "Yoga & méditation"],
            availability: "Du lundi au dimanche, 8h–22h",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-01-28"),
            rating: 4.9,
            reviewCount: 156,
            imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
            tags: ["Spa", "Massage", "Wellness", "À domicile", "Paris"],
          },
        },
      },
    }),
    // Shopping
    db.user.create({
      data: {
        email: "contact@isabelle-style.fr",
        name: "Isabelle Fontaine",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Isabelle Fontaine — Personal Shopper",
            shortBio: "Conseil en image et accompagnement shopping luxe, Paris et Monaco",
            description: "Ancienne directrice achats pour plusieurs maisons de haute couture, Isabelle accompagne une clientèle exigeante dans leurs achats et la constitution de leur garde-robe. Accès en exclusivité aux ventes privées des grandes maisons, suivi personnalisé.",
            city: "Paris",
            zone: "Paris – Côte d'Azur",
            categoryId: shopping.id,
            budgetRange: BudgetRange.LUXE,
            services: ["Relooking complet", "Shopping accompagné", "Ventes privées", "Conseil garde-robe", "Achats en ligne"],
            availability: "Sur rendez-vous uniquement",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-02-20"),
            rating: 4.8,
            reviewCount: 41,
            imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
            tags: ["Mode", "Luxe", "Paris", "Monaco", "Haute couture"],
          },
        },
      },
    }),
    // Experiences
    db.user.create({
      data: {
        email: "contact@secrets-cannes.fr",
        name: "Secrets de Cannes",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Secrets de Cannes",
            shortBio: "Accès exclusifs, yachts privés et expériences uniques sur la Côte d'Azur",
            description: "Secrets de Cannes ouvre les portes des expériences les plus rares de la Côte d'Azur : location de yachts privés, accès backstage au Festival, dîners sur l'eau, hélicoptères privatifs. Notre carnet d'adresses est unique.",
            city: "Cannes",
            zone: "Côte d'Azur",
            categoryId: experiences.id,
            budgetRange: BudgetRange.ULTRA_LUXE,
            services: ["Yacht privé", "Hélicoptère", "Accès VIP Festival", "Dîner sur l'eau", "Îles privées"],
            availability: "Saison mai–septembre, réservation 1 semaine minimum",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-03-10"),
            rating: 4.9,
            reviewCount: 33,
            imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800",
            tags: ["Yacht", "Cannes", "Festival", "VIP", "Côte d'Azur"],
          },
        },
      },
    }),
    // Travel Planning
    db.user.create({
      data: {
        email: "contact@horizons-prives.fr",
        name: "Horizons Privés",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Horizons Privés",
            shortBio: "Agence de voyages ultra-personnalisés pour une clientèle d'exception",
            description: "Horizons Privés conçoit des voyages entièrement sur-mesure : jets privés, lodges exclusifs, safaris en bush camp privatif, croisières en voilier. Chaque itinéraire est unique, pensé dans les moindres détails par nos travel designers.",
            city: "Paris",
            zone: "Monde entier",
            categoryId: travel.id,
            budgetRange: BudgetRange.ULTRA_LUXE,
            services: ["Jet privé", "Safaris exclusifs", "Croisières privées", "Voyages de noces", "Expéditions polaires"],
            availability: "Consultation sous 24h, délai minimum 2 semaines",
            status: PartnerStatus.VERIFIED,
            verifiedAt: new Date("2024-01-10"),
            rating: 4.9,
            reviewCount: 78,
            imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
            tags: ["Jet privé", "Safari", "Voyage sur-mesure", "Monde entier"],
          },
        },
      },
    }),
    // Pending partner
    db.user.create({
      data: {
        email: "contact@monaco-events.mc",
        name: "Monaco Private Events",
        password: await bcrypt.hash("Partner1234!", 12),
        role: Role.PARTNER,
        partnerProfile: {
          create: {
            companyName: "Monaco Private Events",
            shortBio: "Organisation d'événements exclusifs à Monaco et sur la Côte d'Azur",
            description: "Monaco Private Events propose une gamme complète de services événementiels pour une clientèle internationale. Soirées privées, incentives, accès aux événements emblématiques de Monaco.",
            city: "Monaco",
            zone: "Côte d'Azur",
            categoryId: evenementiel.id,
            budgetRange: BudgetRange.ULTRA_LUXE,
            services: ["Soirées privées", "Incentives", "Grand Prix", "Accès yacht club", "Gala privé"],
            availability: "Toute l'année",
            status: PartnerStatus.PENDING,
            rating: 0,
            reviewCount: 0,
            tags: ["Monaco", "Événementiel", "Grand Prix", "VIP"],
          },
        },
      },
    }),
  ]);

  // ─── Concierge Requests ───────────────────────────────────────────────────
  const client1Profile = client1.clientProfile!;
  const client2Profile = client2.clientProfile!;

  const request1 = await db.conciergeRequest.create({
    data: {
      clientId: client1Profile.id,
      categoryId: travel.id,
      title: "Voyage de noces — Maldives & Seychelles",
      description: "Nous souhaitons organiser un voyage de noces d'environ 3 semaines combinant les Maldives et les Seychelles. Nous cherchons des hôtels overwater exclusifs, des excursions privées et un service impeccable. Budget non limité si l'expérience le justifie.",
      city: "Paris",
      desiredDate: new Date("2025-06-15"),
      budgetRange: BudgetRange.ULTRA_LUXE,
      urgency: UrgencyLevel.PRIORITAIRE,
      status: RequestStatus.IN_PROGRESS,
    },
  });

  const request2 = await db.conciergeRequest.create({
    data: {
      clientId: client1Profile.id,
      categoryId: evenementiel.id,
      title: "Anniversaire surprise — 50 personnes",
      description: "Organisation d'un anniversaire surprise pour 50 invités dans un lieu d'exception parisien. Thème art déco, dîner assis, musique live. Date flexible courant décembre.",
      city: "Paris",
      desiredDate: new Date("2024-12-20"),
      budgetRange: BudgetRange.LUXE,
      urgency: UrgencyLevel.STANDARD,
      status: RequestStatus.MATCHED,
    },
  });

  const request3 = await db.conciergeRequest.create({
    data: {
      clientId: client2Profile.id,
      categoryId: restauration.id,
      title: "Dîner d'affaires gastronomique — 8 personnes",
      description: "Dîner d'affaires dans un cadre privatisable pour 8 personnes à Lyon. Cuisine gastronomique française, cave à vins, service discret et professionnel. Client international.",
      city: "Lyon",
      desiredDate: new Date("2024-11-28"),
      budgetRange: BudgetRange.LUXE,
      urgency: UrgencyLevel.URGENT,
      status: RequestStatus.COMPLETED,
      completedAt: new Date("2024-11-28"),
    },
  });

  const request4 = await db.conciergeRequest.create({
    data: {
      clientId: client2Profile.id,
      categoryId: chauffeur.id,
      title: "Transferts VIP — Semaine déplacements pro",
      description: "Besoin d'un chauffeur privé pour une semaine de déplacements professionnels à Paris : hôtel, réunions, aéroport. Véhicule de prestige, chauffeur en livrée.",
      city: "Paris",
      desiredDate: new Date("2024-12-02"),
      budgetRange: BudgetRange.PREMIUM,
      urgency: UrgencyLevel.PRIORITAIRE,
      status: RequestStatus.PENDING,
    },
  });

  // ─── Request Updates (timeline) ───────────────────────────────────────────
  await db.requestUpdate.createMany({
    data: [
      { requestId: request1.id, status: RequestStatus.PENDING, note: "Demande reçue. Notre équipe l'analyse.", isInternal: false },
      { requestId: request1.id, status: RequestStatus.REVIEWING, note: "Votre demande est en cours d'analyse. Nous sélectionnons les meilleures options.", isInternal: false },
      { requestId: request1.id, status: RequestStatus.MATCHED, note: "Nous avons identifié un partenaire de voyage d'exception correspondant parfaitement à vos attentes.", isInternal: false },
      { requestId: request1.id, status: RequestStatus.IN_PROGRESS, note: "Horizons Privés travaille sur votre itinéraire. Vous recevrez une proposition complète sous 48h.", isInternal: false },
      { requestId: request2.id, status: RequestStatus.PENDING, note: "Demande reçue. Notre équipe événementielle se mobilise.", isInternal: false },
      { requestId: request2.id, status: RequestStatus.REVIEWING, note: "Analyse des disponibilités des lieux et prestataires en cours.", isInternal: false },
      { requestId: request2.id, status: RequestStatus.MATCHED, note: "Atelier Événements a été sélectionné pour votre anniversaire. Prise de contact sous 24h.", isInternal: false },
      { requestId: request3.id, status: RequestStatus.PENDING, note: "Demande reçue.", isInternal: false },
      { requestId: request3.id, status: RequestStatus.COMPLETED, note: "Prestation réalisée avec succès. Nous espérons que le dîner a été à la hauteur de vos attentes.", isInternal: false },
    ],
  });

  // ─── Recommendations ──────────────────────────────────────────────────────
  const travelPartner = partnerUsers[8];
  const travelPartnerProfile = await db.partnerProfile.findUnique({
    where: { userId: travelPartner.id },
  });

  const eventPartner = partnerUsers[4];
  const eventPartnerProfile = await db.partnerProfile.findUnique({
    where: { userId: eventPartner.id },
  });

  if (travelPartnerProfile) {
    await db.recommendation.create({
      data: {
        requestId: request1.id,
        partnerId: travelPartnerProfile.id,
        score: 95,
        matchReasons: ["Expertise parfaitement adaptée", "Localisation idéale", "Budget parfaitement aligné", "Partenaire certifié Quintess", "Excellence reconnue"],
        rank: 1,
        isSelected: true,
      },
    });
  }

  if (eventPartnerProfile) {
    await db.recommendation.create({
      data: {
        requestId: request2.id,
        partnerId: eventPartnerProfile.id,
        score: 88,
        matchReasons: ["Expertise parfaitement adaptée", "Localisation idéale", "Budget compatible", "Partenaire certifié Quintess"],
        rank: 1,
        isSelected: true,
      },
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log("");
  console.log("📋 Comptes de test:");
  console.log("  Admin  → admin@quintess.fr / Admin1234!");
  console.log("  Client → sophie.leclerc@email.fr / Client1234!");
  console.log("  Client → antoine.beaumont@email.fr / Client1234!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
