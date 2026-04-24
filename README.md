# Quintess — MVP

Plateforme premium de conciergerie et de mise en relation entre clients et professionnels du luxe.

---

## Stack

- **Next.js 14** — App Router, Server Components
- **TypeScript** — typage strict
- **Tailwind CSS + composants UI** — design système luxe
- **Prisma + PostgreSQL** — ORM et base de données
- **Auth custom** — JWT (jose) + bcryptjs, cookies HTTP-only
- **Zod + React Hook Form** — validation formulaires
- **Sonner** — notifications toast

---

## Installation

### 1. Prérequis
- Node.js 18+
- PostgreSQL 14+ en local (ou Supabase, Railway, etc.)

### 2. Cloner et installer

```bash
cd quintess
npm install
```

### 3. Variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/quintess"
AUTH_SECRET="votre-secret-aleatoire-minimum-32-caracteres"
```

Générer un secret sécurisé :
```bash
openssl rand -base64 32
```

### 4. Base de données

```bash
# Créer la base et appliquer le schéma
npx prisma migrate dev --name init

# Insérer les données de démonstration
npm run db:seed
```

### 5. Composants UI

Certains composants shadcn/ui sont inclus manuellement. Si vous souhaitez les régénérer :

```bash
npx shadcn@latest init
npx shadcn@latest add button input label card badge dialog select separator avatar tabs textarea
```

### 6. Lancer en développement

```bash
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000)

---

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@quintess.fr | Admin1234! |
| Client | sophie.leclerc@email.fr | Client1234! |
| Client | antoine.beaumont@email.fr | Client1234! |

---

## Pages principales

| URL | Description |
|---|---|
| `/` | Page d'accueil premium |
| `/connexion` | Connexion |
| `/inscription` | Inscription client |
| `/dashboard` | Tableau de bord client |
| `/demande/nouvelle` | Formulaire nouvelle demande |
| `/demande/resultats?requestId=xxx` | Résultats de recommandation |
| `/demande/[id]` | Détail + suivi d'une demande |
| `/profil` | Profil client |
| `/admin` | Dashboard admin |
| `/admin/demandes` | Liste des demandes |
| `/admin/demandes/[id]` | Gestion d'une demande |
| `/admin/partenaires` | Liste des partenaires |
| `/admin/partenaires/nouveau` | Ajouter un partenaire |
| `/admin/partenaires/[id]` | Fiche partenaire + actions |
| `/admin/clients` | Liste des clients |

---

## Scripts utiles

```bash
npm run dev          # Démarrer en développement
npm run build        # Build de production
npm run db:migrate   # Appliquer les migrations
npm run db:seed      # Insérer les données de test
npm run db:studio    # Interface Prisma Studio
npm run db:reset     # Réinitialiser la base (ATTENTION : destructif)
```

---

## Moteur de matching

Le moteur de recommandation (`lib/matching/engine.ts`) score chaque partenaire selon :

| Critère | Points |
|---|---|
| Catégorie identique | 40 |
| Localisation (même ville) | 20 |
| Budget aligné | 20 |
| Partenaire certifié Quintess | 15 |
| Note (rating) | 5 |

Les 5 meilleurs partenaires sont stockés en base (`Recommendation`) et affichés avec leurs raisons de matching.

---

## Plan d'évolution V2

### Court terme
- [ ] Upload d'images partenaires (Vercel Blob / Cloudinary)
- [ ] Messagerie temps réel entre client et conciergerie (WebSocket / Pusher)
- [ ] Notifications email (Resend)
- [ ] Système d'avis clients sur les partenaires

### Moyen terme
- [ ] OAuth (Google, Apple) via Auth.js v5
- [ ] Dashboard partenaire autonome (gestion de profil, calendrier)
- [ ] Moteur de matching IA (OpenAI Embeddings sur descriptions)
- [ ] Paiement en ligne (Stripe) avec facturation
- [ ] Multi-langue (FR / EN)

### Long terme
- [ ] Application mobile (React Native / Expo)
- [ ] Espace programme de fidélité (tiers client)
- [ ] API partenaire (webhooks, intégrations tierces)
- [ ] Analytics avancés (Posthog / Mixpanel)
