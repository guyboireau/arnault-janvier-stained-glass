# 🎨 Arnault Janvier - Site Portfolio Vitrier d'Art

Site vitrine professionnel pour Arnault Janvier, maître verrier et artisan vitrailliste basé à Paris.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e)](https://supabase.com/)

📖 [Guide de déploiement](./DEPLOYMENT.md) • 🎯 [Documentation projet](./.claude/CLAUDE.md)

---

## 📋 À propos

Ce site permet à Arnault Janvier de :
- ✨ Présenter son savoir-faire et son parcours d'artisan vitrailliste
- 🖼️ Exposer ses réalisations dans une galerie photos/vidéos
- 📧 Recevoir des demandes de contact de clients potentiels
- ⚙️ Gérer son contenu de manière autonome via un back-office
- 🌍 Toucher une audience internationale (FR/EN/ES)

---

## ✨ Fonctionnalités

### Partie Publique
- 🏠 Page d'accueil avec hero section et projets mis en avant
- 👤 Page À propos - Parcours et expertise
- 🖼️ Galerie - Projets catégorisés avec filtres
- 📄 Pages projet détaillées avec images et vidéos
- 📧 Formulaire de contact avec envoi d'email
- 🌍 Multilingue - Français, Anglais, Espagnol
- 📱 Responsive - Design mobile-first

### Back-Office Admin
- 🔐 Authentification sécurisée via Supabase
- 📊 Dashboard avec statistiques
- ✏️ CRUD Projets complet
- 🏷️ Gestion des catégories
- 📷 Upload d'images vers Supabase Storage
- 💬 Gestion des messages de contact
- ⚙️ Paramètres du site
- 📱 Interface mobile adaptative

### SEO & Performance
- 🗺️ Sitemap dynamique généré automatiquement
- 🤖 Robots.txt configuré
- 📈 Open Graph metadata pour réseaux sociaux
- ⚡ ISR (Incremental Static Regeneration)
- 🎯 Score Lighthouse > 90

---

## 🛠️ Stack Technique

- **Framework:** Next.js 14 (App Router)
- **Langage:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **i18n:** next-intl 3
- **Email:** Resend
- **Animations:** Framer Motion 11
- **Déploiement:** Vercel

---

## 🚀 Installation & Développement Local

### Prérequis

```bash
Node.js >= 18.x
npm >= 9.x
```

### 1. Cloner le repository

```bash
git clone <repository-url>
cd arnault-janvier-stained-glass
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier exemple :

```bash
cp .env.local.example .env.local
```

Éditer `.env.local` avec vos clés :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend (pour l'envoi d'emails)
RESEND_API_KEY=re_your-api-key
CONTACT_EMAIL_TO=contact@arnault-janvier.fr
CONTACT_EMAIL_FROM=noreply@arnault-janvier.fr

# Revalidation
REVALIDATE_TOKEN=your-random-secret-token

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurer la base de données

1. Créer un projet sur [Supabase](https://supabase.com)
2. Exécuter les migrations depuis le SQL Editor :
   ```bash
   # Copier le contenu de :
   supabase/migrations/COMPLETE_IMAGE_UPLOAD_SETUP.sql
   ```
3. Créer un utilisateur admin (voir [DEPLOYMENT.md](./DEPLOYMENT.md))

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 6. Accéder à l'admin

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Credentials: Ceux configurés dans Supabase Auth

---

## 📁 Structure du Projet

```
arnault-janvier-stained-glass/
├── public/                      # Assets statiques
├── src/
│   ├── app/                     # Pages Next.js (App Router)
│   │   ├── [locale]/            # Routes internationalisées
│   │   │   ├── (public)/        # Pages publiques
│   │   │   ├── admin/           # Pages admin
│   │   │   └── login/           # Authentification
│   │   ├── api/                 # API Routes
│   │   ├── sitemap.ts           # Sitemap dynamique
│   │   └── robots.ts            # Robots.txt
│   ├── components/              # Composants React
│   │   ├── ui/                  # Composants génériques
│   │   ├── layout/              # Header, Footer, Nav
│   │   ├── admin/               # Composants admin
│   │   └── ...
│   ├── lib/                     # Utilitaires et configuration
│   │   └── supabase/            # Clients Supabase
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # Types TypeScript
│   └── i18n/                    # Configuration i18n
├── messages/                    # Traductions (FR/EN/ES)
├── supabase/                    # Migrations SQL
├── .env.local                   # Variables d'environnement (non versionné)
├── .env.local.example           # Template variables d'environnement
├── DEPLOYMENT.md                # Guide de déploiement complet
└── README.md                    # Ce fichier
```

---

## 🧪 Scripts Disponibles

```bash
# Développement
npm run dev          # Lancer le serveur de dev (port 3000)

# Build
npm run build        # Build de production
npm run start        # Lancer le build de production

# Qualité de code
npm run lint         # Linter ESLint
```

---

## 🌍 Internationalisation

Le site supporte 3 langues avec next-intl :

| Locale | Langue | Statut |
|--------|--------|--------|
| `fr` | Français | ✅ Complet (défaut) |
| `en` | English | ✅ Complet |
| `es` | Español | ✅ Complet |

### Utiliser les traductions

```tsx
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

---

## 📊 Performance

### Objectifs Lighthouse

- ✅ Performance: > 90
- ✅ Accessibilité: > 95
- ✅ Best Practices: > 95
- ✅ SEO: 100

### Optimisations

- ISR (Incremental Static Regeneration)
- Image Optimization avec `next/image`
- Code Splitting automatique
- Font Optimization avec `next/font`
- Compression automatique des images

---

## 📧 Configuration Email

Le site utilise **Resend** pour l'envoi d'emails.

### En développement
- Utiliser `@resend.dev` (emails de test)
- Limite : 100 emails/jour

### En production
- Configurer votre domaine dans Resend
- Vérifier le domaine via DNS
- Emails depuis `noreply@votre-domaine.com`

Voir [DEPLOYMENT.md](./DEPLOYMENT.md#configuration-resend) pour les détails.

---

## 🚀 Déploiement

### Guide complet

Consulter [DEPLOYMENT.md](./DEPLOYMENT.md) pour :
- Configuration Supabase
- Configuration Resend
- Déploiement Vercel
- Configuration domaine
- Checklist post-déploiement

### Déploiement rapide Vercel

1. Pusher le code sur GitHub
2. Importer sur [Vercel](https://vercel.com)
3. Configurer les variables d'environnement
4. Déployer

---

## 📝 Licence

© 2025 Arnault Janvier. Tous droits réservés.

---

## 📞 Support

- 📖 Documentation: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🎯 Doc projet: [CLAUDE.md](./.claude/CLAUDE.md)

---

**✨ Fait avec passion pour mettre en valeur l'art du vitrail**
