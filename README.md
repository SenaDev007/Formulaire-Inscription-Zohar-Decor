# 🎨 Zohar Décor — Plateforme d'inscription en ligne

> **Formation Professionnelle en Résine Époxy — 09 au 11 juillet 2026**
> *« Des souvenirs qui brillent à jamais »*

Plateforme web moderne, responsive et professionnelle permettant aux
participants de s'inscrire à la formation en résine époxy organisée par
**Zohar Décor**. Paiement Mobile Money + carte via **FeeXPay**, confirmation
automatique email + WhatsApp, et tableau de bord administrateur sécurisé.

---

## 📋 Table des matières

1. [Aperçu](#aperçu)
2. [Stack technique](#stack-technique)
3. [Fonctionnalités](#fonctionnalités)
4. [Installation locale](#installation-locale)
5. [Variables d'environnement](#variables-denvironnement)
6. [Déploiement sur Vercel](#déploiement-sur-vercel-recommandé)
7. [Intégrations externes](#intégrations-externes)
8. [Documentation API](#documentation-api)
9. [Sécurité](#sécurité)
10. [Maintenance & sauvegardes](#maintenance--sauvegardes)

---

## 📸 Aperçu

- **Identité visuelle** : Or élégant (`#C9A227`), Noir profond (`#111111`), Blanc cassé (`#F8F6F2`), Beige clair (`#EFE8DD`)
- **Style** : Premium, moderne, élégant, féminin et professionnel
- **Logo** : `public/logo_zohar_decor.png`

### Pages (single-page app, routage par hash)

| View | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Hero, programme, créations, tarifs, FAQ |
| Inscription | `/#register` | Formulaire complet (12 champs) |
| Paiement | `/#payment` | FeeXPay — MTN MoMo, Moov, Celtiis, carte |
| Confirmation | `/#confirmation` | N° d'inscription `ZD-2026-XXX`, reçu, WhatsApp |
| Admin | `/#admin` | Dashboard sécurisé (login + JWT cookie) |

---

## 🛠 Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Langage | **TypeScript 5** strict |
| UI | **Tailwind CSS 4** + **shadcn/ui** (New York) + Lucide icons |
| Animation | **Framer Motion** |
| Forms | **react-hook-form** + **zod** |
| Base de données | **Prisma ORM** + SQLite (dev) / PostgreSQL (prod Vercel) |
| Auth | **JWT** (cookies httpOnly) + **bcryptjs** |
| Email | **Resend** (`noreply@academiahelm.com`) |
| Paiement | **FeeXPay** (https://feexpay.me) — MTN MoMo, Moov Money, Celtiis Cash, carte |
| WhatsApp | Lien direct `wa.me` (pas d'API Business requise) |
| Exports | **xlsx** (Excel) + **pdfkit** (PDF) |
| Runtime | **Bun** (recommandé) ou Node.js 20+ |
| Hébergement | **Vercel** (recommandé) |

---

## ✨ Fonctionnalités

### Pour les participants

- 🏠 **Page d'accueil premium** : bannière, infos clés (dates, lieu, prix, places), galerie de créations, FAQ
- 📝 **Formulaire d'inscription** (12 champs) avec validation zod + honeypot anti-spam
- 💳 **Paiement FeeXPay** : 4 moyens (MTN MoMo, Moov Money, Celtiis Cash, carte VISA/Mastercard)
- 🎫 **Confirmation automatique** avec numéro unique `ZD-2026-001`, `ZD-2026-002`, …
- 📧 **Email de confirmation** (HTML premium, reçu de paiement, détails formation)
- 💬 **Lien WhatsApp pré-rempli** pour confirmation instantanée

### Pour l'administrateur

- 🔐 **Authentification sécurisée** (JWT en cookie httpOnly)
- 📊 **Statistiques temps réel** :
  - Nombre total d'inscrits
  - Places restantes
  - Montant total encaissé (détail inscription vs complet)
  - Taux de remplissage
- 👥 **Tableau des inscrits** : recherche, filtre par statut, modification, validation manuelle
- 📤 **Exports** : Excel (.xlsx) + PDF stylé
- 📧 **Email collectif** (filtre : tous / payants / en attente / validés)
- 💬 **WhatsApp collectif** : génère un lien `wa.me` par inscrit

---

## 🚀 Installation locale

### Prérequis

- **Bun** >= 1.3 (ou Node.js 20+, npm)
- **Git**

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/SenaDev007/Formulaire-Inscription-Zohar-Decor.git
cd Formulaire-Inscription-Zohar-Decor

# 2. Installer les dépendances
bun install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Éditer .env avec vos valeurs (voir section ci-dessous)

# 5. Créer la base de données SQLite + générer le client Prisma
bun run db:push
bun run db:generate

# 6. Démarrer le serveur de dev
bun run dev
# → http://localhost:3000

# 7. Créer le compte admin par défaut (une seule fois)
curl -X POST http://localhost:3000/api/seed
# → Compte: admin@zohardecor.com / ZoharDecor2026!
# (modifiable dans .env avant le seed)
```

---

## 🔐 Variables d'environnement

Voir `.env.example` pour le template. Voici le détail :

```bash
# ===== Database =====
# DEV (SQLite — fichier local, zéro setup):
DATABASE_URL="file:./dev.db"

# PRODUCTION (Vercel Postgres / Supabase / Neon):
# DATABASE_URL="postgresql://user:pass@host:5432/zohar_decor?schema=public"

# ===== App =====
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
NEXT_PUBLIC_WHATSAPP_NUMBER="22900000000"  # WhatsApp Business Zohar Décor

# ===== Admin bootstrap =====
ADMIN_BOOTSTRAP_EMAIL="admin@zohardecor.com"
ADMIN_BOOTSTRAP_PASSWORD="ZoharDecor2026!"

# ===== JWT =====
JWT_SECRET="generate-a-long-random-string"  # ex: openssl rand -base64 64
JWT_EXPIRES_IN="7d"

# ===== Resend (Email) =====
RESEND_API_KEY="re_xxxxxxxxxx"
EMAIL_FROM_NOREPLY="noreply@academiahelm.com"
EMAIL_FROM_NAME="Zohar Décor"

# ===== FeeXPay (Paiement) =====
# Docs: https://docs.feexpay.me
# Laisser vide → MODE DÉMO (paiements auto-confirmés pour test)
FEEXPAY_BASE_URL="https://api.feexpay.me"
FEEXPAY_SHOP_ID=""          # Votre shop ID marchand FeeXPay
FEEXPAY_API_TOKEN=""        # Votre token API FeeXPay
FEEXPAY_SANDBOX="false"     # true en dev, false en prod

# ===== Contact =====
CONTACT_PHONE="+22900000000"
CONTACT_EMAIL="contact@zohardecor.com"
```

> ⚠️ **Mode démo** : si `FEEXPAY_SHOP_ID` ou `FEEXPAY_API_TOKEN` est vide,
> l'app fonctionne en mode démo. Le paiement est simulé via
> `/api/payment/demo-confirm` qui marque automatiquement la transaction
> comme réussie. Idéal pour les tests et la démo.

---

## ▲ Déploiement sur Vercel (recommandé)

Vercel est l'hébergement le plus simple pour ce projet Next.js. Voici la
procédure complète, étape par étape.

### Étape 1 — Préparer le schéma PostgreSQL

Avant de déployer, il faut passer le schéma Prisma de SQLite à PostgreSQL.

**Éditez `prisma/schema.prisma`** :

```prisma
datasource db {
  // Commentez la ligne sqlite :
  // provider = "sqlite"
  // Décommentez la ligne postgresql :
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Committez et poussez sur GitHub :

```bash
git add prisma/schema.prisma
git commit -m "chore: switch Prisma provider to postgresql for Vercel"
git push
```

### Étape 2 — Créer une base PostgreSQL gratuite

Choisissez UNE des trois options ci-dessous (toutes gratuites) :

#### Option A — Vercel Postgres (le plus simple)

1. Sur https://vercel.com/dashboard → votre projet → onglet **Storage**
2. Cliquez **Create Database** → **Postgres** (Neon-powered)
3. Donnez un nom : `zohar-decor`
4. Une fois créée, cliquez **Connect to Project** → Vercel ajoute
   automatiquement `DATABASE_URL` (et `POSTGRES_*`) aux variables d'env

#### Option B — Supabase (le plus généreux en gratuit)

1. Créez un compte sur https://supabase.com
2. New Project → `zohar-decor` → région **Frankfurt** ou **Paris**
3. Settings → Database → Connection string → **URI**
4. Copiez l'URI (format : `postgresql://postgres.xxxx:pass@xxxx.supabase.co:5432/postgres`)
5. Vous l'ajouterez à Vercel à l'étape 4

#### Option C — Neon (le plus rapide)

1. Créez un compte sur https://neon.tech
2. New Project → `zohar-decor`
3. Copy connection string → `postgresql://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require`
4. Vous l'ajouterez à Vercel à l'étape 4

### Étape 3 — Connecter le repo GitHub à Vercel

1. Allez sur https://vercel.com/new
2. Importez le repo `SenaDev007/Formulaire-Inscription-Zohar-Decor`
3. **Framework Preset** : Next.js (auto-détecté)
4. **Build Command** : `prisma generate && next build` (déjà dans `vercel.json`)
5. **Install Command** : laissez par défaut (Vercel détecte `bun.lock`)

### Étape 4 — Configurer les variables d'environnement

Dans Vercel → votre projet → **Settings → Environment Variables**, ajoutez
TOUTES les variables ci-dessous (voir `.env.example` pour le template) :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Votre connection string PostgreSQL (de l'étape 2) |
| `NEXT_PUBLIC_APP_URL` | `https://votre-projet.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Votre numéro WhatsApp Business |
| `ADMIN_BOOTSTRAP_EMAIL` | `admin@zohardecor.com` |
| `ADMIN_BOOTSTRAP_PASSWORD` | Un mot de passe fort (à garder secret) |
| `JWT_SECRET` | `openssl rand -base64 64` (générez une chaîne aléatoire) |
| `JWT_EXPIRES_IN` | `7d` |
| `RESEND_API_KEY` | Votre clé Resend (`re_xxx`) |
| `EMAIL_FROM_NOREPLY` | `noreply@academiahelm.com` |
| `EMAIL_FROM_NAME` | `Zohar Décor` |
| `FEEXPAY_BASE_URL` | `https://api.feexpay.me` |
| `FEEXPAY_SHOP_ID` | Votre shop ID FeeXPay (dashboard feexpay.me) |
| `FEEXPAY_API_TOKEN` | Votre token API FeeXPay |
| `FEEXPAY_SANDBOX` | `false` (production) |
| `CONTACT_PHONE` | `+22900000000` |
| `CONTACT_EMAIL` | `contact@zohardecor.com` |

> 💡 Cochez toutes les cases d'environnement : **Production**, **Preview**, **Development**

### Étape 5 — Déployer

1. Cliquez **Deploy** sur Vercel
2. Attendez que le build se termine (3-5 minutes la première fois)
3. Vercel affiche l'URL : `https://votre-projet.vercel.app`

### Étape 6 — Initialiser la base de données + admin

Une fois déployé, exécutez UNE FOIS la commande seed pour créer les tables
et le compte admin :

```bash
# Remplacez par votre URL Vercel
curl -X POST https://votre-projet.vercel.app/api/seed
```

Vous verrez :
```json
{
  "success": true,
  "message": "Seed complete",
  "participantCount": 0,
  "trainingInfo": { ... }
}
```

> ⚠️ **Sécurité** : après le premier seed, protégez ou supprimez l'endpoint
> `/api/seed` (ajoutez une vérification d'admin, ou supprimez le fichier en
> production). En l'état, quiconque connaît l'URL peut appeler le seed, mais
> il est idempotent (ne crée l'admin que s'il n'existe pas).

### Étape 7 — Tester

1. Visitez `https://votre-projet.vercel.app` → page d'accueil
2. Cliquez **Je m'inscris maintenant** → remplissez le formulaire
3. Vous êtes redirigé vers FeeXPay → payez (ou utilisez le mode sandbox)
4. Confirmation s'affiche avec votre `ZD-2026-001`
5. Email envoyé à votre adresse
6. Allez sur `/#admin` → connectez-vous → voyez votre inscription

### Étape 8 — Configurer le webhook FeeXPay (IMPORTANT)

Pour que FeeXPay notifie votre app quand un paiement est confirmé :

1. Allez sur le dashboard FeeXPay → **Settings** → **Webhooks** (ou **Callback URL**)
2. Ajoutez l'URL : `https://votre-projet.vercel.app/api/payment/webhook`
3. Sélectionnez les événements : **payment.success**, **payment.failed**

> ℹ️ Même sans webhook configuré, l'app fonctionne : la page de confirmation
> interroge automatiquement l'API FeeXPay toutes les 4 secondes pour vérifier
> le statut. Le webhook accélère juste la confirmation.

### Domaine personnalisé (optionnel)

1. Vercel → votre projet → **Settings → Domains**
2. Ajoutez `zohardecor.com` (ou votre domaine)
3. Configurez les DNS chez votre registrar (Vercel vous guide)
4. Mettez à jour `NEXT_PUBLIC_APP_URL` avec le nouveau domaine

---

## 🔌 Intégrations externes

### 1. FeeXPay (paiement) — https://feexpay.me

**Endpoints FeeXPay utilisés** (tous documentés dans `src/lib/feexpay.ts`) :

| Endpoint | Méthode | Usage |
|----------|---------|-------|
| `/api/shop/{shop}/get_shop` | GET | Valide le shop marchand |
| `/api/transactions/requesttopay/integration` | POST | Paiement Mobile Money (MTN, MOOV, CELTIIS) |
| `/api/transactions/card/inittransact/integration` | POST | Paiement carte (VISA, MASTERCARD) → renvoie une URL de redirection |
| `/api/transactions/getrequesttopay/integration/{ref}` | GET | Vérifier le statut d'une transaction |

**Authentification** : Le `token` API et le `shop` ID sont envoyés DANS LE
CORPS de la requête (form-encodé), PAS dans un header Bearer.

**Configuration** :
1. Créez un compte marchand sur https://feexpay.me
2. Récupérez votre **Shop ID** et **API Token** depuis le dashboard
3. Mettez-les dans `FEEXPAY_SHOP_ID` et `FEEXPAY_API_TOKEN`

**Providers supportés au Bénin** :
- MTN MoMo (`MTN`)
- Moov Money (`MOOV`)
- Celtiis Cash (`CELTIIS`)
- Carte VISA (`VISA`)
- Carte Mastercard (`MASTERCARD`)

**Flux de paiement** :

- **Mobile Money** : asynchrone — FeeXPay envoie une push USSD au téléphone
  du client, on reçoit une `reference` qu'on interroge périodiquement
- **Carte** : synchrone — FeeXPay renvoie une `url` vers laquelle on
  redirige le client ; il saisit sa carte sur la page FeeXPay, puis est
  redirigé vers notre `callback_url`

### 2. Resend (email) — https://resend.com

**Utilisé pour :**
- Email de confirmation automatique après paiement (HTML premium + reçu)
- Email collectif depuis le dashboard admin

**Configuration :**
1. Créez un compte sur https://resend.com
2. Vérifiez le domaine `academiahelm.com` (ou votre domaine) dans Resend
3. Générez une clé API et mettez-la dans `RESEND_API_KEY`

> ℹ️ Si `RESEND_API_KEY` est vide, les emails ne sont pas envoyés mais
> l'app fonctionne (logs dans la console serveur).

### 3. WhatsApp (lien direct)

**Pas d'API WhatsApp Business requise.**

L'app génère des liens `https://wa.me/{phone}?text={message}` pré-remplis.
Le participant ou l'admin clique sur le lien, WhatsApp s'ouvre avec le
message pré-rempli, l'utilisateur n'a plus qu'à appuyer sur Envoyer.

**Endpoints :**
- `GET /api/whatsapp/confirm-link?registrationId=ZD-2026-XXX` — lien de
  confirmation pour un participant
- `POST /api/admin/bulk-whatsapp` — génère les liens pour tous les
  inscrits (filtre : tous / payants / en attente / validés)

**Numéro cible :** `NEXT_PUBLIC_WHATSAPP_NUMBER` dans `.env`

---

## 📡 Documentation API

### Publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/register` | Inscrire un participant |
| `POST` | `/api/payment/init` | Initialiser un paiement FeeXPay |
| `GET` | `/api/payment/webhook` | Vérifier le statut d'un paiement (polling) |
| `POST` | `/api/payment/webhook` | Webhook entrant FeeXPay |
| `GET` | `/api/payment/demo-confirm?paymentId=xxx` | Mode démo : simule un paiement réussi |
| `GET` | `/api/confirmation?registrationId=xxx` | Récupérer les détails d'une inscription |
| `GET` | `/api/whatsapp/confirm-link?registrationId=xxx` | Lien WhatsApp pré-rempli |
| `POST` | `/api/seed` | Crée l'admin par défaut (à protéger en prod) |

### Admin (JWT requis)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/admin/login` | Connexion admin |
| `POST` | `/api/admin/logout` | Déconnexion |
| `GET` | `/api/admin/me` | Profil admin courant |
| `GET` | `/api/admin/stats` | Statistiques dashboard |
| `GET` | `/api/admin/participants` | Liste des inscrits (search, status) |
| `GET` | `/api/admin/participants/[id]` | Détail d'un inscrit |
| `PATCH` | `/api/admin/participants/[id]` | Modifier un inscrit |
| `DELETE` | `/api/admin/participants/[id]` | Annuler un inscrit (status → CANCELLED) |
| `POST` | `/api/admin/validate-payment` | Valider manuellement un paiement |
| `GET` | `/api/admin/export?format=xlsx` | Export Excel |
| `GET` | `/api/admin/export?format=pdf` | Export PDF |
| `POST` | `/api/admin/bulk-email` | Email collectif |
| `POST` | `/api/admin/bulk-whatsapp` | Liens WhatsApp collectifs |

---

## 🔒 Sécurité

- **Authentification admin** : JWT signé avec `JWT_SECRET`, stocké en cookie
  `httpOnly` + `Secure` en production + `SameSite=Lax`
- **Mots de passe** : hachés avec **bcryptjs** (10 rounds)
- **Anti-spam** : honeypot `website` field dans le formulaire d'inscription
- **Validation** : tous les inputs validés avec **zod** (server-side)
- **HTTPS** : automatique sur Vercel
- **Variables sensibles** : `JWT_SECRET`, `FEEXPAY_API_TOKEN`, `RESEND_API_KEY`
  ne sont JAMAIS exposées côté client
- **Capacité** : 10 places max, vérifiée server-side à l'inscription
- **Unicité** : email + téléphone WhatsApp uniques par participant
- **Webhook FeeXPay** : re-poll systématiquement l'API FeeXPay pour confirmer
  le statut (ne fait pas confiance au payload webhook seul)

### Checklist de mise en production

- [ ] `.env` / variables Vercel remplies avec de vraies valeurs
- [ ] `JWT_SECRET` est une chaîne aléatoire longue (64+ caractères)
- [ ] `FEEXPAY_SHOP_ID` et `FEEXPAY_API_TOKEN` configurés
- [ ] `RESEND_API_KEY` configuré et domaine vérifié
- [ ] Base de données PostgreSQL en production (PAS SQLite)
- [ ] `prisma/schema.prisma` : `provider = "postgresql"`
- [ ] `/api/seed` exécuté une fois pour créer l'admin
- [ ] Webhook FeeXPay configuré : `https://votre-domaine.com/api/payment/webhook`
- [ ] `/api/seed` protégé ou supprimé après création de l'admin

---

## 💾 Maintenance & sauvegardes

### Sauvegarde automatique (PostgreSQL)

```bash
# Crontab quotidien à 3h du matin (sur un serveur externe)
0 3 * * * pg_dump $DATABASE_URL | gzip > /backups/zohar-$(date +\%Y\%m\%d).sql.gz
# Garder 30 jours
0 4 * * * find /backups -name "zohar-*.sql.gz" -mtime +30 -delete
```

### Vercel Postgres / Supabase / Neon

Ces services ont des sauvegardes automatiques intégrées :
- **Vercel Postgres** : sauvegarde quotidienne, rétention 7 jours
- **Supabase** : sauvegarde quotidienne, rétention 7 jours (plan gratuit)
- **Neon** : Point-in-Time Recovery sur 7 jours (plan gratuit)

### Mise à jour

```bash
git pull
bun install
bun run db:push  # si schéma modifié
# Sur Vercel : redéployage automatique après git push
```

---

## 📞 Contact

- **Marque** : Zohar Décor
- **Slogan** : *Des souvenirs qui brillent à jamais*
- **Lieu** : Zongo 2, von Axe Beni CHC-Presdo, à 100 m du carrefour après
  EPP La Source, Terre Rouge en allant au CEG Nima.
- **Dates formation** : 09 au 11 juillet 2026
- **Capacité** : 10 places seulement

---

## 📄 Licence

Code privé — © Zohar Décor. Tous droits réservés.
