# 🚀 Guide de Déploiement - Arnault Janvier Portfolio

Ce document détaille les étapes complètes pour déployer le site portfolio en production.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration Supabase](#configuration-supabase)
3. [Configuration Resend](#configuration-resend)
4. [Déploiement Vercel](#déploiement-vercel)
5. [Configuration du domaine](#configuration-du-domaine)
6. [Post-déploiement](#post-déploiement)
7. [Maintenance](#maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prérequis

### Comptes requis

- ✅ Compte GitHub (pour héberger le code)
- ✅ Compte Supabase (pour la base de données) - [supabase.com](https://supabase.com)
- ✅ Compte Resend (pour l'envoi d'emails) - [resend.com](https://resend.com)
- ✅ Compte Vercel (pour l'hébergement) - [vercel.com](https://vercel.com)
- ⚙️ Nom de domaine (optionnel) - recommandé pour la production

### Outils locaux

```bash
node >= 18.x
npm >= 9.x
git
```

---

## Configuration Supabase

### 1. Créer un projet Supabase

1. Se connecter à [supabase.com](https://supabase.com)
2. Cliquer sur "New Project"
3. Choisir un nom : `arnault-janvier-production`
4. Définir un mot de passe de base de données fort (noter précieusement)
5. Choisir une région proche (ex: eu-west-1 pour l'Europe)
6. Attendre la création du projet (2-3 minutes)

### 2. Récupérer les clés API

Dans Settings > API :

```bash
Project URL: https://xxxxx.supabase.co
anon key: eyJxxxxx...
service_role key: eyJxxxxx... (secret, ne pas exposer)
```

### 3. Exécuter les migrations

Option A - Via Dashboard (Recommandé) :
1. Aller dans "SQL Editor"
2. Copier le contenu de `supabase/migrations/COMPLETE_IMAGE_UPLOAD_SETUP.sql`
3. Exécuter le script
4. Vérifier que toutes les tables sont créées (Table Editor)

Option B - Via CLI :
```bash
npx supabase link --project-ref xxxxx
npx supabase db push
```

### 4. Configurer le stockage

1. Aller dans "Storage"
2. Créer un bucket nommé `project-images`
3. Définir comme public :
   - Click sur le bucket
   - Settings → Public bucket : ON
4. Configurer les policies (déjà dans la migration)

### 5. Créer l'utilisateur admin

Dans SQL Editor, exécuter :

```sql
-- Créer un utilisateur admin pour se connecter
-- Remplacer par votre email et mot de passe
INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
)
VALUES (
    'admin@arnault-janvier.fr',
    crypt('VotreMotDePasse123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);
```

**Note:** Vous pouvez aussi créer l'utilisateur via Supabase Auth Dashboard.

---

## Configuration Resend

### 1. Créer un compte Resend

1. S'inscrire sur [resend.com](https://resend.com)
2. Vérifier votre email

### 2. Configurer le domaine (Option A - Recommandée)

Pour utiliser votre propre domaine (ex: `arnault-janvier.fr`) :

1. Aller dans "Domains"
2. Ajouter votre domaine
3. Configurer les enregistrements DNS :
   ```
   Type: TXT
   Name: @
   Value: [fourni par Resend]

   Type: MX
   Name: @
   Priority: 10
   Value: [fourni par Resend]
   ```
4. Attendre la vérification (peut prendre jusqu'à 48h)

### 3. Utiliser Resend.dev (Option B - Test uniquement)

Pour les tests, vous pouvez utiliser des emails `@resend.dev` :
- Pas de configuration DNS nécessaire
- Limité à 100 emails/jour
- Les emails arrivent dans votre compte Resend

### 4. Récupérer la clé API

1. Aller dans "API Keys"
2. Créer une nouvelle clé : "Production - Arnault Janvier"
3. Copier la clé : `re_xxxxx...`
4. ⚠️ **Sauvegarder immédiatement** (non ré-affichable)

---

## Déploiement Vercel

### 1. Préparer le repository GitHub

```bash
# Si pas encore fait
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Créer un repo sur GitHub puis
git remote add origin https://github.com/votre-username/arnault-janvier-site.git
git push -u origin main
```

### 2. Importer le projet sur Vercel

1. Se connecter à [vercel.com](https://vercel.com)
2. Cliquer sur "Add New..." → "Project"
3. Importer le repository GitHub
4. Configurer le projet :
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next

### 3. Configurer les variables d'environnement

Dans "Settings" → "Environment Variables", ajouter :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...

# Resend
RESEND_API_KEY=re_xxxxx...
CONTACT_EMAIL_TO=contact@arnault-janvier.fr
CONTACT_EMAIL_FROM=noreply@arnault-janvier.fr

# Revalidation
REVALIDATE_TOKEN=VotreTokenSecretIciGenerezUnTokenAleatoire123

# Site URL (ajuster après déploiement)
NEXT_PUBLIC_SITE_URL=https://arnault-janvier.vercel.app
```

**💡 Astuce:** Générer un token aléatoire sécurisé :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Déployer

1. Cliquer sur "Deploy"
2. Attendre le build (2-5 minutes)
3. Accéder au site via l'URL fournie : `https://arnault-janvier.vercel.app`

### 5. Vérifier le déploiement

✅ Checklist :
- [ ] Site accessible
- [ ] Navigation fonctionne (FR/EN/ES)
- [ ] Galerie affiche les projets
- [ ] Formulaire de contact s'affiche
- [ ] Login admin fonctionne
- [ ] Sitemap accessible : `/sitemap.xml`
- [ ] Robots.txt accessible : `/robots.txt`

---

## Configuration du domaine

### 1. Ajouter un domaine custom sur Vercel

1. Aller dans "Settings" → "Domains"
2. Ajouter : `arnault-janvier.fr` et `www.arnault-janvier.fr`
3. Vercel fournit les enregistrements DNS nécessaires

### 2. Configurer DNS chez votre registrar

Exemple pour Namecheap/OVH/Gandi :

```
Type: A
Host: @
Value: 76.76.21.21 (Vercel IP)

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

### 3. Mettre à jour l'URL du site

Une fois le domaine actif, mettre à jour dans Vercel :

```bash
NEXT_PUBLIC_SITE_URL=https://arnault-janvier.fr
```

Redéployer pour appliquer les changements.

### 4. Configurer Resend avec le domaine

Retourner dans Resend et mettre à jour :
```bash
CONTACT_EMAIL_FROM=noreply@arnault-janvier.fr
CONTACT_EMAIL_TO=contact@arnault-janvier.fr
```

---

## Post-déploiement

### 1. Tester le formulaire de contact

1. Remplir le formulaire sur `/contact`
2. Vérifier l'email reçu
3. Vérifier la soumission dans Supabase (table `contact_submissions`)
4. Vérifier dans `/admin/messages`

### 2. Peupler la base de données

Via Admin Panel (`/admin`) :

1. **Créer des catégories:**
   - Vitraux Religieux
   - Art Contemporain
   - Restauration
   - Décoration Intérieure

2. **Ajouter des projets:**
   - Uploader les images
   - Remplir les titres/descriptions en FR/EN/ES
   - Définir la catégorie
   - Publier

3. **Configurer les paramètres du site:**
   - Informations de contact
   - Liens réseaux sociaux
   - Contenu "À propos"

### 3. Optimiser les images

Avant d'uploader :
```bash
# Recommandations
- Format: JPEG pour photos, PNG pour logos
- Taille max: 2048px (largeur)
- Qualité: 85%
- Compression: TinyPNG ou Squoosh
```

### 4. Configurer Analytics (Optionnel)

Si Google Analytics souhaité :
1. Créer propriété GA4
2. Ajouter `NEXT_PUBLIC_GA_ID` dans Vercel
3. Redéployer

### 5. Tester SEO

Utiliser ces outils :
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- Lighthouse dans Chrome DevTools

---

## Maintenance

### Mettre à jour le contenu

1. Se connecter à `/admin`
2. Ajouter/modifier projets
3. Le cache est mis à jour automatiquement

### Forcer la revalidation du cache

Si besoin de forcer un refresh :

```bash
curl -X POST https://arnault-janvier.fr/api/revalidate \
  -H "x-revalidate-token: VotreTokenSecret" \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/gallery", "/"]}'
```

### Sauvegardes Supabase

Supabase fait des sauvegardes automatiques. Pour exporter manuellement :

1. Dashboard → Database → Backups
2. Télécharger le dump SQL
3. Stocker en lieu sûr

### Monitorer les erreurs

Vercel fournit des logs en temps réel :
- Dashboard → Project → Logs
- Voir les erreurs serveur
- Analyser les performances

### Mettre à jour les dépendances

```bash
# Vérifier les updates disponibles
npm outdated

# Mettre à jour (attention aux breaking changes)
npm update

# Tester localement
npm run build
npm run start

# Si ok, commit et push (redéploiement auto)
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push
```

---

## Troubleshooting

### ❌ Le site ne se déploie pas

**Erreur de build:**
```bash
# Vérifier localement
npm run build

# Si échec, corriger les erreurs TypeScript/ESLint
npm run lint
```

**Variables d'environnement manquantes:**
- Vérifier dans Vercel Settings → Environment Variables
- Redéployer après ajout

### ❌ Les emails ne partent pas

**Vérifier:**
1. Clé API Resend correcte
2. Domaine vérifié (ou utiliser @resend.dev)
3. Logs Vercel pour les erreurs
4. Quota Resend non dépassé

**Test manuel:**
```javascript
// Test depuis Node.js local
const { Resend } = require('resend');
const resend = new Resend('re_xxxxx');
await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'votre@email.com',
  subject: 'Test',
  html: '<p>Test email</p>'
});
```

### ❌ Admin ne se connecte pas

**Vérifier:**
1. Utilisateur créé dans Supabase Auth
2. Email/password corrects
3. RLS policies actives
4. Clés Supabase correctes dans Vercel

**Reset password:**
Via Supabase Dashboard → Authentication → Users → Reset Password

### ❌ Images ne s'affichent pas

**Vérifier:**
1. Bucket `project-images` existe et est public
2. Storage policies configurées
3. Images uploadées avec le bon format
4. URL Supabase correcte dans next.config.js

### ❌ Sitemap/Robots.txt introuvables

**Vérifier:**
1. Fichiers `sitemap.ts` et `robots.ts` dans `/src/app/`
2. Build réussi sans erreurs
3. Accéder directement : `https://votresite.com/sitemap.xml`
4. Cache navigateur vidé

### 🔍 Débugger en production

**Voir les logs serveur:**
```bash
# Dans Vercel Dashboard
Deployments → Latest → Logs

# Filtrer par type
Functions → Sélectionner une fonction → Voir les invocations
```

**Activer le mode debug Next.js:**
```bash
# Ajouter en variable d'environnement Vercel
DEBUG=*
```

---

## 📞 Support

### Ressources utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Resend](https://resend.com/docs)
- [Documentation Vercel](https://vercel.com/docs)

### Contacts d'urgence

- Support Vercel: support@vercel.com
- Support Supabase: support@supabase.com
- Support Resend: support@resend.com

---

## ✅ Checklist finale de déploiement

Avant de considérer le site en production, vérifier:

- [ ] Projet Supabase créé et configuré
- [ ] Toutes les migrations exécutées
- [ ] Utilisateur admin créé et testé
- [ ] Compte Resend configuré
- [ ] Domaine vérifié (ou @resend.dev pour tests)
- [ ] Repository GitHub à jour
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Premier déploiement réussi
- [ ] Site accessible via URL
- [ ] Login admin fonctionne
- [ ] Formulaire de contact envoie des emails
- [ ] Au moins 3-5 projets publiés
- [ ] Toutes les catégories créées
- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible
- [ ] Metadata Open Graph vérifiés
- [ ] Tests sur mobile (iOS + Android)
- [ ] Tests sur desktop (Chrome, Firefox, Safari)
- [ ] Score Lighthouse > 80 sur toutes métriques
- [ ] Domaine custom configuré (si applicable)
- [ ] SSL actif (automatique avec Vercel)
- [ ] Google Analytics configuré (optionnel)
- [ ] Documentation transmise au client
- [ ] Formation admin effectuée

**🎉 Félicitations! Le site est maintenant en production!**
