# 📸 Système d'Upload d'Images - Instructions

## ✅ Fonctionnalités Implémentées

### 1. **Composant ImageUpload Avancé**
- ✨ **Drag & Drop** : Glissez-déposez vos images directement
- 📱 **Compatible Mobile** : Fonctionne sur téléphone, tablette et ordinateur
- 🗜️ **Compression Automatique** : Les images > 10MB sont automatiquement compressées
- 🖼️ **Prévisualisation** : Aperçu des images avant sauvegarde
- 🗑️ **Suppression Facile** : Retirez des images en un clic
- 📊 **Multi-fichiers** : Uploadez jusqu'à 20 images à la fois

### 2. **Formats Supportés**
- JPG / JPEG
- PNG
- WebP
- GIF

### 3. **Optimisations**
- Redimensionnement automatique (max 2048x2048px)
- Compression JPEG à 85% de qualité
- Taille max : 10MB par image (avant compression)

---

## 🚀 Configuration Requise

### Étape 1 : Exécuter les Migrations SQL

Connectez-vous à votre projet Supabase et exécutez ces migrations dans l'ordre :

```bash
# 1. Créer la table project_images
psql -f supabase/migrations/002_project_images.sql

# 2. Configurer le bucket Storage
psql -f supabase/migrations/003_storage_bucket.sql
```

**OU via l'interface Supabase :**

1. Allez dans **SQL Editor** de votre projet Supabase
2. Exécutez le contenu de `002_project_images.sql`
3. Puis exécutez le contenu de `003_storage_bucket.sql`

### Étape 2 : Vérifier le Bucket Storage

1. Dans Supabase, allez dans **Storage**
2. Vérifiez que le bucket `project-images` existe
3. Assurez-vous qu'il est marqué comme **Public**

Si le bucket n'existe pas :
- Créez-le manuellement avec le nom `project-images`
- Cochez "Public bucket"
- Définissez une taille max de 10MB par fichier
- Ajoutez les types MIME : `image/jpeg`, `image/png`, `image/webp`, `image/gif`

---

## 💻 Utilisation

### Dans l'Interface Admin

1. **Créer un nouveau projet** :
   - Allez dans `/admin/projects/new`
   - Remplissez les informations du projet
   - **Section "Images du projet"** : 
     - Cliquez ou glissez-déposez vos images
     - Les images s'uploadent automatiquement
     - Prévisualisez et réorganisez
   - Cliquez "Create Project"

2. **Modifier un projet existant** :
   - Allez dans `/admin/projects/[id]/edit`
   - Ajoutez ou supprimez des images
   - Les modifications sont sauvegardées à la soumission du formulaire

### Depuis Mobile / Tablette

L'upload fonctionne parfaitement sur mobile :
- Ouvrez l'interface admin sur votre téléphone
- Cliquez sur la zone d'upload
- Sélectionnez des photos depuis votre galerie
- Ou prenez une photo directement avec l'appareil photo
- L'upload et la compression se font automatiquement

---

## 🔍 Détails Techniques

### Structure de la Base de Données

**Table `project_images` :**
```sql
- id: UUID (clé primaire)
- project_id: UUID (référence au projet)
- image_url: TEXT (URL publique Supabase)
- alt_text: TEXT (texte alternatif pour accessibilité)
- display_order: INTEGER (ordre d'affichage)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Stockage des Images

- **Bucket Supabase** : `project-images`
- **Chemin** : `uploads/{timestamp}-{random}.{ext}`
- **URL publique** : Générée automatiquement par Supabase

### Sécurité

- ✅ Validation des types MIME côté client et serveur
- ✅ Limite de taille par fichier (10MB)
- ✅ Row Level Security (RLS) activé
- ✅ Upload réservé aux utilisateurs authentifiés
- ✅ Lecture publique pour l'affichage sur le site

---

## 🐛 Dépannage

### "Erreur lors de l'upload"
- Vérifiez que le bucket `project-images` existe dans Supabase Storage
- Assurez-vous d'être authentifié en tant qu'admin
- Vérifiez les politiques RLS sur le bucket

### "Le fichier est trop volumineux"
- Les fichiers > 10MB sont automatiquement compressés
- Si l'erreur persiste, réduisez manuellement la taille de l'image

### "Format de fichier non supporté"
- Utilisez uniquement JPG, PNG, WebP ou GIF
- Convertissez les autres formats avant l'upload

### Les images ne s'affichent pas
- Vérifiez que le bucket est bien public
- Testez l'URL de l'image directement dans le navigateur
- Vérifiez les politiques RLS de lecture

---

## 📝 Notes Additionnelles

### Prochaines Améliorations Possibles

- [ ] Réorganisation drag & drop des images
- [ ] Édition des images (crop, rotation)
- [ ] Tags et métadonnées pour les images
- [ ] Galerie lightbox sur le frontend
- [ ] Upload par lots (zip)
- [ ] Support de vidéos

### Performance

- Les images sont automatiquement optimisées
- Le cache est configuré à 1 heure (3600s)
- Utilisez un CDN pour de meilleures performances en production

---

## 🎨 Personnalisation

Pour modifier les limites et paramètres, éditez :
- **Nombre max d'images** : `maxFiles` dans `ProjectForm.tsx` (ligne ~139)
- **Taille max** : `maxSizeMB` dans `ProjectForm.tsx` (ligne ~140)
- **Qualité compression** : `ImageUpload.tsx` ligne ~70 (0.85 = 85%)
- **Dimensions max** : `ImageUpload.tsx` lignes ~59-60 (MAX_WIDTH/HEIGHT)

---

**✨ Bon upload !**
