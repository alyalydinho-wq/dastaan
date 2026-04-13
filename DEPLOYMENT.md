# Guide de Déploiement - TBM Occasions

Ce guide détaille les étapes pour déployer l'application TBM en production. 
*Note : L'application est construite avec **Vite + React (Frontend) et Express (Backend)**, et non Next.js. Vercel peut héberger cette architecture grâce aux Serverless Functions pour le backend.*

## 1. Prérequis : Base de données (Neon.tech)

1. Créez un compte sur [Neon.tech](https://neon.tech/).
2. Créez un nouveau projet (ex: `tbm-db`) avec PostgreSQL.
3. Allez dans le tableau de bord, section **Connection Details**.
4. Copiez la chaîne de connexion (Connection string).
5. Elle ressemblera à ceci : `postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`.

## 2. Prérequis : Stockage Images (Cloudinary)

1. Créez un compte sur [Cloudinary](https://cloudinary.com/).
2. Allez dans le **Dashboard**.
3. Récupérez vos identifiants :
   - Cloud Name
   - API Key
   - API Secret
4. Formatez l'URL Cloudinary : `cloudinary://<api_key>:<api_secret>@<cloud_name>`

## 3. Déploiement sur Vercel

1. Poussez votre code sur un dépôt GitHub.
2. Connectez-vous à [Vercel](https://vercel.com/) et cliquez sur **Add New... > Project**.
3. Importez votre dépôt GitHub.
4. Dans la section **Build and Output Settings** :
   - Framework Preset : `Vite`
   - Build Command : `npm run build`
   - Output Directory : `dist`
5. Dans la section **Environment Variables**, ajoutez les variables suivantes :
   - `DATABASE_URL` : *Votre URL Neon.tech*
   - `JWT_SECRET` : *Une chaîne de caractères aléatoire et sécurisée (ex: générée via `openssl rand -base64 32`)*
   - `CLOUDINARY_CLOUD_NAME` : *Votre Cloud Name*
   - `CLOUDINARY_API_KEY` : *Votre API Key*
   - `CLOUDINARY_API_SECRET` : *Votre API Secret*
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` : *(Optionnel) Vos identifiants SMTP pour l'envoi d'emails*
6. Cliquez sur **Deploy**. Le premier déploiement peut échouer si la base de données n'est pas encore migrée, c'est normal.

## 4. Exécution des migrations Prisma en production

Une fois le projet lié à Vercel, vous devez synchroniser le schéma de la base de données.

1. Ouvrez votre terminal en local.
2. Assurez-vous d'avoir installé la CLI Vercel : `npm i -g vercel`
3. Liez votre projet local à Vercel : `vercel link`
4. Téléchargez les variables d'environnement de production : `vercel env pull .env.production`
5. Exécutez la migration sur la base de données de production :
   ```bash
   npx dotenv -e .env.production -- npx prisma db push
   ```

## 5. Création du premier compte Admin

Pour créer le compte administrateur initial en production :

1. Toujours avec les variables d'environnement de production chargées, exécutez le script de seed :
   ```bash
   npx dotenv -e .env.production -- npx tsx prisma/seed.ts
   ```
2. Le compte par défaut sera créé (généralement `admin@tbm.re` / `admin123` selon votre fichier `seed.ts`). **Pensez à changer ce mot de passe immédiatement après la première connexion.**

## 6. Checklist de mise en production

Avant de communiquer l'URL officielle, vérifiez les points suivants :

- [ ] Variables d'environnement Vercel configurées (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`)
- [ ] Base de données Neon migrée avec succès
- [ ] Compte admin créé via le script de seed
- [ ] Logo TBM uploadé dans `/public/logo-tbm.png` (ou favicon mis à jour)
- [ ] Test du formulaire de rendez-vous (côté client)
- [ ] Test de l'upload d'image Cloudinary (depuis l'espace admin)
- [ ] Test de la connexion admin et de la déconnexion
- [ ] Vérification du SEO (titre, description, balises Open Graph sur la page d'accueil et les véhicules)
- [ ] Test responsive mobile (navigation, grilles de véhicules, modales)

## Note sur l'architecture Vercel (Express + Vite)

Le fichier `vercel.json` inclus à la racine du projet configure Vercel pour :
1. Construire le frontend statique avec Vite dans le dossier `dist`.
2. Déployer `server.ts` en tant que Serverless Function pour gérer toutes les requêtes commençant par `/api`.
3. Rediriger toutes les autres requêtes vers `index.html` pour que React Router gère la navigation côté client.
