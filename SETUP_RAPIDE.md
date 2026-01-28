# 🔧 Guide de Configuration Rapide - Upload d'Images

## ⚠️ Problème: "relation projects does not exist"

Cette erreur signifie que le schéma de base de données n'a pas encore été créé dans votre projet Supabase.

---

## ✅ Solution en 2 Étapes

### Étape 1: Exécuter la Migration Initiale

1. Ouvrez votre projet Supabase: https://app.supabase.com
2. Allez dans **SQL Editor** (dans le menu de gauche)
3. Cliquez sur **+ New Query**
4. Copiez et collez **tout le contenu** du fichier:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
5. Cliquez sur **Run** (ou appuyez sur Ctrl/Cmd + Enter)
6. Attendez que le message "Success" apparaisse

### Étape 2: Configurer l'Upload d'Images

1. Toujours dans **SQL Editor**, créez une nouvelle requête
2. Copiez et collez **tout le contenu** du fichier:
   ```
   supabase/migrations/COMPLETE_IMAGE_UPLOAD_SETUP.sql
   ```
3. Cliquez sur **Run**
4. Vérifiez que vous voyez les messages de succès ✅

---

## 🎯 Méthode Alternative (Simple)

Si vous préférez, vous pouvez exécuter **uniquement** le fichier:
```
supabase/migrations/COMPLETE_IMAGE_UPLOAD_SETUP.sql
```

Ce fichier est intelligent et:
- ✅ Vérifie que tout est en ordre
- ✅ Crée uniquement ce qui manque
- ✅ Ne casse rien si vous l'exécutez plusieurs fois
- ✅ Configure tout automatiquement (table + bucket Storage)

---

## 🔍 Vérification

Après avoir exécuté les migrations, vérifiez que tout fonctionne:

### 1. Vérifier les Tables
Dans **SQL Editor**, exécutez:
```sql
SELECT * FROM public.projects LIMIT 1;
SELECT * FROM public.project_images LIMIT 1;
```
Aucune erreur = ✅ Succès

### 2. Vérifier le Bucket Storage
1. Allez dans **Storage** (menu de gauche)
2. Vous devriez voir un bucket nommé `project-images`
3. Il doit être marqué comme **Public**

---

## 🚀 Utilisation

Une fois la configuration terminée:

1. Allez dans votre interface admin: `/admin/projects/new`
2. Remplissez les informations du projet
3. Faites défiler jusqu'à la section **"Images du projet"**
4. Glissez-déposez vos images ou cliquez pour les sélectionner
5. Les images s'uploadent automatiquement !

---

## 💡 Conseils

- **Sur mobile**: Cliquez sur la zone d'upload pour accéder à votre galerie photo
- **Compression auto**: Les gros fichiers sont automatiquement optimisés
- **Formats acceptés**: JPG, PNG, WebP, GIF
- **Taille max**: 10MB par image

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez encore des problèmes:

1. **Vérifiez votre connexion** à Supabase
2. **Assurez-vous d'être authentifié** comme admin
3. **Consultez les logs** dans la console du navigateur (F12)
4. **Vérifiez Storage > Policies** dans Supabase

---

## 📋 Checklist Complète

- [ ] Migration 001 exécutée (schéma initial)
- [ ] Migration COMPLETE_IMAGE_UPLOAD_SETUP exécutée
- [ ] Table `project_images` existe
- [ ] Bucket `project-images` existe et est public
- [ ] Politiques RLS configurées
- [ ] Test d'upload réussi

**Tout est coché ? Vous êtes prêt ! 🎉**
