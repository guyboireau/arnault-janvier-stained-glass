# 📸 Configuration du Flux Instagram Automatique

Ce guide explique comment configurer l'intégration Instagram pour afficher automatiquement vos derniers posts sur le site.

## 🎯 Vue d'ensemble

Le site peut afficher automatiquement vos dernières publications Instagram grâce à l'API Instagram Basic Display. Les posts sont mis en cache pendant 1 heure pour optimiser les performances.

---

## 📋 Prérequis

- Un compte Instagram (Business ou Creator recommandé)
- Un compte Facebook Developer
- Les posts Instagram doivent être publics

---

## 🚀 Configuration Étape par Étape

### Étape 1: Créer une Application Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Cliquez sur **"Mes Apps"** → **"Créer une app"**
3. Sélectionnez le type **"Consumer"**
4. Donnez un nom à votre app (ex: "Arnault Janvier Portfolio")
5. Renseignez votre email
6. Créez l'app

### Étape 2: Ajouter Instagram Basic Display

1. Dans le tableau de bord de votre app, allez dans **"Produits"**
2. Trouvez **"Instagram Basic Display"** et cliquez sur **"Configurer"**
3. Cliquez sur **"Créer une nouvelle app"**
4. Remplissez les informations requises:
   - **Nom d'affichage** : Votre nom
   - **URL de confidentialité** : `https://votre-domaine.com/privacy` (créer une page si nécessaire)
   - **URL des conditions d'utilisation** : `https://votre-domaine.com/terms`

### Étape 3: Configurer l'Application

Dans les paramètres de l'app Instagram Basic Display :

1. **Valid OAuth Redirect URIs** :
   ```
   https://socialsuite.app/callback/
   ```

2. **Deauthorize Callback URL** :
   ```
   https://votre-domaine.com/api/instagram/deauthorize
   ```

3. **Data Deletion Request URL** :
   ```
   https://votre-domaine.com/api/instagram/delete
   ```

4. Sauvegardez les changements

### Étape 4: Ajouter un Utilisateur de Test (pour Instagram Personnel)

1. Allez dans **"Rôles"** → **"Testeurs Instagram"**
2. Cliquez sur **"Ajouter des testeurs Instagram"**
3. Entrez votre nom d'utilisateur Instagram
4. Sur Instagram, allez dans **Paramètres** → **Apps et sites web** → **Invitations de testeurs**
5. Acceptez l'invitation

### Étape 5: Générer un Token d'Accès

#### Option A: Utilisation de l'interface Facebook

1. Dans l'app Instagram Basic Display, allez dans **"Basic Display"**
2. Sous **"User Token Generator"**, cliquez sur **"Generate Token"**
3. Connectez-vous avec votre compte Instagram
4. Autorisez l'application
5. Copiez le **Access Token** généré

#### Option B: Utilisation de l'API (recommandé pour production)

1. Notez votre **Instagram App ID** et **Instagram App Secret**

2. Construisez l'URL d'autorisation :
   ```
   https://api.instagram.com/oauth/authorize
     ?client_id={app-id}
     &redirect_uri={redirect-uri}
     &scope=user_profile,user_media
     &response_type=code
   ```

3. Visitez cette URL dans votre navigateur
4. Autorisez l'application
5. Récupérez le `code` dans l'URL de redirection

6. Échangez le code contre un token :
   ```bash
   curl -X POST \
     https://api.instagram.com/oauth/access_token \
     -F client_id={app-id} \
     -F client_secret={app-secret} \
     -F grant_type=authorization_code \
     -F redirect_uri={redirect-uri} \
     -F code={code}
   ```

### Étape 6: Obtenir un Token Longue Durée (60 jours)

Le token initial expire après 1 heure. Pour obtenir un token longue durée :

```bash
curl -i -X GET "https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_secret={instagram-app-secret}
  &access_token={short-lived-token}"
```

Vous recevrez un token valide 60 jours.

### Étape 7: Configurer les Variables d'Environnement

Ajoutez le token à votre fichier `.env.local` :

```bash
# Instagram Feed
INSTAGRAM_ACCESS_TOKEN=IGQVJ...votre-token-ici
```

Ajoutez aussi à Vercel (pour la production) :
1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez `INSTAGRAM_ACCESS_TOKEN`
4. Redéployez

---

## 🔄 Renouvellement Automatique du Token

Les tokens longue durée expirent après 60 jours. Vous devez les renouveler régulièrement.

### Option 1: Renouvellement Manuel

Avant l'expiration (recevez une notification par email 7 jours avant) :

```bash
curl -i -X GET "https://graph.instagram.com/refresh_access_token
  ?grant_type=ig_refresh_token
  &access_token={current-token}"
```

### Option 2: Renouvellement Automatique

Le site inclut un endpoint pour renouveler le token :

```bash
curl -X POST https://votre-domaine.com/api/instagram \
  -H "Content-Type: application/json" \
  -d '{"action": "refresh-token"}'
```

**Conseil:** Configurez un cron job ou GitHub Action pour exécuter ceci tous les 30 jours.

---

## 🎨 Personnalisation du Flux

### Changer le Nombre de Posts Affichés

Dans `/src/app/[locale]/(public)/page.tsx` :

```tsx
<InstagramFeedAuto postsToShow={9} /> // Affiche 9 posts au lieu de 6
```

### Personnaliser les Textes

Dans `/src/components/social/InstagramFeedAuto.tsx` :

```tsx
<InstagramFeedAuto
  username="glassncraft"
  postsToShow={6}
  title="Mes Créations Instagram"
  subtitle="Suivez mon processus créatif"
/>
```

### Changer l'Emplacement

Le flux Instagram est actuellement sur la page d'accueil. Pour l'ajouter ailleurs :

```tsx
import InstagramFeedAuto from '@/components/social/InstagramFeedAuto';

// Dans votre composant
<InstagramFeedAuto postsToShow={6} />
```

---

## 🐛 Dépannage

### Le flux n'affiche aucun post

**Vérifications:**
1. Le token est-il configuré dans `.env.local` ?
2. Le token est-il expiré ? (max 60 jours)
3. Le compte Instagram est-il public ?
4. Y a-t-il des posts sur le compte ?

**Solution:** Vérifiez les logs du serveur :
```bash
npm run dev
# Puis ouvrir la page avec le flux Instagram
# Regarder les erreurs dans le terminal
```

### Erreur "Instagram API not configured"

Le token n'est pas configuré. Ajoutez `INSTAGRAM_ACCESS_TOKEN` à `.env.local`.

### Erreur "Invalid access token"

Le token a expiré ou est invalide. Générez un nouveau token (voir Étape 5).

### Les posts ne se rafraîchissent pas

Le cache est de 1 heure. Pour forcer le rafraîchissement :
1. Redémarrez le serveur de dev
2. En production, attendez 1 heure ou redéployez

---

## 📊 Limites de l'API

- **Taux limite:** 200 requêtes par heure par token
- **Cache:** 1 heure (configurable dans `/src/app/api/instagram/route.ts`)
- **Expiration token:** 60 jours pour les tokens longue durée

---

## 🔐 Sécurité

**Important:**
- Ne commitez JAMAIS votre token dans Git
- Utilisez `.env.local` (déjà dans `.gitignore`)
- Configurez le token uniquement dans Vercel pour la production
- Renouvelez le token avant expiration

---

## 📱 Alternative: Flux Instagram Manuel

Si vous ne souhaitez pas utiliser l'API, vous pouvez utiliser le composant manuel :

```tsx
import InstagramFeed from '@/components/social/InstagramFeed';

<InstagramFeed
  username="glassncraft"
  postsToShow={6}
/>
```

Ce composant utilise les embeds Instagram officiels, mais nécessite de mettre à jour manuellement les URLs des posts.

---

## 📞 Support

Pour plus d'aide :
- [Documentation Instagram Basic Display](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Forum Facebook Developers](https://developers.facebook.com/community/)

---

**✨ Une fois configuré, votre flux Instagram se mettra à jour automatiquement!**
