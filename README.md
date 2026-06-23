# 🎨 Zohar Décor — Plateforme d'inscription en ligne

> **Formation Professionnelle en Résine Époxy — 09 au 11 juillet 2026**
> *« Des souvenirs qui brillent à jamais »*

Plateforme web moderne, responsive et professionnelle permettant aux
participants de s'inscrire à la formation en résine époxy organisée par
**Zohar Décor**. Paiement Mobile Money + carte via Flexpay, confirmation
automatique email + WhatsApp, et tableau de bord administrateur sécurisé.

---

## 📋 Table des matières

1. [Aperçu](#aperçu)
2. [Stack technique](#stack-technique)
3. [Fonctionnalités](#fonctionnalités)
4. [Installation locale](#installation-locale)
5. [Variables d'environnement](#variables-denvironnement)
6. [Base de données](#base-de-données)
7. [Intégrations externes](#intégrations-externes)
8. [Déploiement en production](#déploiement-en-production)
9. [Documentation API](#documentation-api)
10. [Sécurité](#sécurité)
11. [Maintenance & sauvegardes](#maintenance--sauvegardes)

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
| Paiement | `/#payment` | Flexpay — MTN MoMo, Moov, Celtiis, carte |
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
| Base de données | **Prisma ORM** + SQLite (dev) / PostgreSQL ou MySQL (prod) |
| Auth | **JWT** (cookies httpOnly) + **bcryptjs** |
| Email | **Resend** (`noreply@academiahelm.com`) |
| Paiement | **Flexpay** (MTN MoMo, Moov Money, Celtiis Cash, carte) |
| WhatsApp | Lien direct `wa.me` (pas d'API Business requise) |
| Exports | **xlsx** (Excel) + **pdfkit** (PDF) |
| Runtime | **Bun** (recommandé) ou Node.js 20+ |

---

## ✨ Fonctionnalités

### Pour les participants

- 🏠 **Page d'accueil premium** : bannière, infos clés (dates, lieu, prix, places), galerie de créations, FAQ
- 📝 **Formulaire d'inscription** (12 champs) avec validation zod + honeypot anti-spam
- 💳 **Paiement Flexpay** : 4 moyens (MTN MoMo, Moov Money, Celtiis Cash, carte)
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
# ou: npm install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Éditer .env avec vos valeurs (voir section ci-dessous)

# 5. Créer la base de données + générer le client Prisma
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

### Build de production

```bash
bun run build
bun run start
```

---

## 🔐 Variables d'environnement

Voir `.env.example` pour le template. Voici le détail :

```bash
# ===== Base de données =====
# SQLite (dev) — fichier local
DATABASE_URL="file:./dev.db"

# PostgreSQL (prod) — exemple Supabase / Neon / Railway
# DATABASE_URL="postgresql://user:pass@host:5432/zohar_decor?schema=public"

# MySQL (prod) — exemple PlanetScale / OVH
# DATABASE_URL="mysql://user:pass@host:3306/zohar_decor"

# ===== App =====
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
NEXT_PUBLIC_WHATSAPP_NUMBER="22900000000"  # Numéro WhatsApp Business Zohar Décor

# ===== Admin bootstrap =====
# Utilisé par /api/seed pour créer le 1er admin
ADMIN_BOOTSTRAP_EMAIL="admin@zohardecor.com"
ADMIN_BOOTSTRAP_PASSWORD="ZoharDecor2026!"

# ===== JWT =====
JWT_SECRET="generate-a-long-random-string"  # ex: openssl rand -base64 64
JWT_EXPIRES_IN="7d"

# ===== Resend (Email) =====
# Obtenir une clé: https://resend.com/api-keys
RESEND_API_KEY="re_xxxxxxxxxx"
EMAIL_FROM_NOREPLY="noreply@academiahelm.com"
EMAIL_FROM_NAME="Zohar Décor"

# ===== Flexpay (Paiement) =====
# Obtenir un token marchand: https://flexpay.cd
FLEXPAY_BASE_URL="https://payment.flexpay.cd/api/v1"
FLEXPAY_MERCHANT_TOKEN=""          # Laisser vide en dev → mode démo
FLEXPAY_WEBHOOK_SECRET=""
FLEXPAY_SANDBOX="false"            # true = ignore la signature webhook

# ===== Contact =====
CONTACT_PHONE="+22900000000"
CONTACT_EMAIL="contact@zohardecor.com"
```

> ⚠️ **Mode démo** : si `FLEXPAY_MERCHANT_TOKEN` est vide, l'app fonctionne en
> mode démo. Le paiement est simulé via `/api/payment/demo-confirm` qui
> marque automatiquement la transaction comme réussie. Idéal pour les tests.

---

## 💾 Base de données

### Schéma (3 modèles)

```
Participant
  ├─ id, registrationId (ZD-2026-XXX), nomComplet, prenoms, sexe,
  │  dateNaissance, telWhatsApp, telSecondaire, email, ville,
  │  profession, niveauEtudes, sourceConnaissance, acceptConditions,
  │  status (PENDING | PAID_INSCRIPTION | PAID_FULL | VALIDATED | CANCELLED),
  │  paymentType (INSCRIPTION | COMPLET), createdAt, updatedAt
  └─ payments: Payment[]

Payment
  ├─ id, participantId, amount (FCFA), type, provider,
  │  providerPhone, flexpayReference, flexpayOrderNumber,
  │  flexpayTransaction, status (PENDING | SUCCESS | FAILED | CANCELLED),
  │  paymentUrl, manuallyValidated, validatedById, createdAt, updatedAt
  └─ participant: Participant

AdminUser
  ├─ id, email, name, passwordHash (bcrypt), role, createdAt, updatedAt
  └─ (relation via Payment.validatedById)

Setting (clé-valeur, pour config dynamique future)
```

### Migrations

```bash
# Push le schéma vers la DB (dev)
bun run db:push

# Créer une migration (prod)
bun run db:migrate -- --name init

# Reset total
bun run db:reset
```

### Passer à PostgreSQL / MySQL en production

1. Éditez `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider = "postgresql"  // ou "mysql"
     url      = env("DATABASE_URL")
   }
   ```
2. Mettez à jour `DATABASE_URL` dans `.env`
3. Exécutez :
   ```bash
   bun run db:push
   curl -X POST https://votre-domaine.com/api/seed  # crée l'admin
   ```

---

## 🔌 Intégrations externes

### 1. Flexpay (paiement)

**Endpoints utilisés :**
- `POST {FLEXPAY_BASE_URL}/pay` — initier un paiement
- `GET {FLEXPAY_BASE_URL}/transaction/{orderNumber}` — vérifier le statut
- Webhook entrant : `POST /api/payment/webhook` (Flexpay appelle cette URL)

**Configuration :**
1. Créez un compte marchand sur https://flexpay.cd
2. Récupérez votre `merchant_token`
3. Mettez-le dans `FLEXPAY_MERCHANT_TOKEN`
4. Configurez l'URL de webhook dans le dashboard Flexpay :
   `https://votre-domaine.com/api/payment/webhook`

**Providers supportés :**
- MTN MoMo (`MTN_MOMO`)
- Moov Money (`MOOV_MONEY`)
- Celtiis Cash (`CELTIIS_CASH`)
- Carte bancaire (`CARD`)

### 2. Resend (email)

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

## 🌐 Déploiement en production

### Option A — Vercel (recommandé, gratuit)

1. Push le code sur GitHub
2. Connectez le repo sur https://vercel.com
3. Configurez les variables d'environnement (voir `.env.example`)
4. Utilisez **Vercel Postgres** ou **Supabase** pour la DB PostgreSQL
5. Déployez

```bash
# Variable DATABASE_URL doit pointer vers Postgres en prod
DATABASE_URL="postgresql://..."
```

### Option B — VPS (Ubuntu/Debian)

```bash
# 1. Cloner + installer
git clone https://github.com/SenaDev007/Formulaire-Inscription-Zohar-Decor.git
cd Formulaire-Inscription-Zohar-Decor
curl -fsSL https://bun.sh/install | bash
bun install

# 2. Configurer
cp .env.example .env
nano .env  # éditer avec les vraies valeurs

# 3. Build + start
bun run build
bun run start  # écoute sur le port 3000

# 4. Reverse proxy avec Caddy / Nginx
# Caddyfile exemple:
# votre-domaine.com {
#   reverse_proxy localhost:3000
# }
```

### Option C — Docker (à venir)

Un `Dockerfile` et `docker-compose.yml` seront ajoutés prochainement.

### Checklist de mise en production

- [ ] `.env` rempli avec de vraies valeurs (PAS le mode démo)
- [ ] `JWT_SECRET` est une chaîne aléatoire longue (64+ caractères)
- [ ] `FLEXPAY_MERCHANT_TOKEN` configuré
- [ ] `RESEND_API_KEY` configuré et domaine vérifié
- [ ] Base de données PostgreSQL/MySQL en production (PAS SQLite)
- [ ] HTTPS activé (Caddy / Nginx / Vercel le gère automatiquement)
- [ ] `curl -X POST https://votre-domaine.com/api/seed` exécuté une fois
- [ ] URL de webhook Flexpay configurée : `https://votre-domaine.com/api/payment/webhook`
- [ ] Backups automatiques de la DB configurés

---

## 📡 Documentation API

### Publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/register` | Inscrire un participant |
| `POST` | `/api/payment/init` | Initialiser un paiement Flexpay |
| `GET` | `/api/payment/webhook` | Vérifier le statut d'un paiement |
| `POST` | `/api/payment/webhook` | Webhook entrant Flexpay |
| `GET` | `/api/payment/demo-confirm?paymentId=xxx` | Mode démo : simule un paiement réussi |
| `GET` | `/api/confirmation?registrationId=xxx` | Récupérer les détails d'une inscription |
| `GET` | `/api/whatsapp/confirm-link?registrationId=xxx` | Lien WhatsApp pré-rempli pour un participant |
| `POST` | `/api/seed` | Crée l'admin par défaut (à protéger/supprimer en prod) |

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

### Exemple : inscription complète

```bash
# 1. Inscription
curl -X POST https://votre-domaine.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "nomComplet": "DOSSOU",
    "prenoms": "Marie-Grace",
    "sexe": "F",
    "dateNaissance": "1998-05-15",
    "telWhatsApp": "+2290197000001",
    "email": "marie.grace@example.com",
    "ville": "Cotonou",
    "profession": "Étudiante",
    "niveauEtudes": "BAC",
    "sourceConnaissance": "WhatsApp",
    "acceptConditions": true
  }'
# → { "success": true, "participant": { "id": "...", "registrationId": "ZD-2026-001", ... } }

# 2. Init paiement
curl -X POST https://votre-domaine.com/api/payment/init \
  -H "Content-Type: application/json" \
  -d '{
    "participantId": "<id>",
    "paymentType": "COMPLET",
    "provider": "MTN_MOMO",
    "providerPhone": "2290197000001"
  }'
# → { "success": true, "payment": { "paymentUrl": "...", ... } }

# 3. Redirection vers paymentUrl (Flexpay ou /api/payment/demo-confirm en démo)

# 4. Flexpay appelle /api/payment/webhook → statut SUCCESS
#    → Email envoyé, participant.status = "PAID_FULL"

# 5. Confirmation
curl https://votre-domaine.com/api/confirmation?registrationId=ZD-2026-001
```

---

## 🔒 Sécurité

- **Authentification admin** : JWT signé avec `JWT_SECRET`, stocké en cookie
  `httpOnly` + `Secure` en production + `SameSite=Lax`
- **Mots de passe** : hachés avec **bcryptjs** (10 rounds)
- **Anti-spam** : honeypot `website` field dans le formulaire d'inscription
- **Validation** : tous les inputs validés avec **zod** (server-side)
- **CORS** : Next.js gère automatiquement (same-origin)
- **HTTPS** : obligatoire en production (Vercel / Caddy / Let's Encrypt)
- **Variables sensibles** : `JWT_SECRET`, `FLEXPAY_MERCHANT_TOKEN`,
  `RESEND_API_KEY` ne sont JAMAIS exposées côté client
- **Capacité** : 10 places max, vérifiée server-side à l'inscription
- **Unicité** : email + téléphone WhatsApp uniques par participant

### Recommandations de production

1. **Révoquez** le token GitHub de bootstrap après le premier push
2. **Supprimez** `/api/seed` ou protégez-le après la création de l'admin
3. **Activez** le rate-limiting (Vercel le gère nativement)
4. **Monitorrez** les webhooks Flexpay (logs serveur)
5. **Backup quotidien** de la base de données

---

## 💾 Maintenance & sauvegardes

### Sauvegarde automatique (PostgreSQL)

```bash
# Crontab quotidien à 3h du matin
0 3 * * * pg_dump $DATABASE_URL | gzip > /backups/zohar-$(date +\%Y\%m\%d).sql.gz
# Garder 30 jours
0 4 * * * find /backups -name "zohar-*.sql.gz" -mtime +30 -delete
```

### Pour SQLite (dev)

```bash
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)
```

### Mise à jour

```bash
git pull
bun install
bun run db:push  # si schéma modifié
# rebuild + restart en prod
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
