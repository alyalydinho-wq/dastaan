# TBM Occasions

Application web full-stack pour la gestion et la vitrine d'une concession de véhicules d'occasion à La Réunion.

## 🛠 Architecture & Stack Technique

Bien que l'application utilise des concepts modernes similaires à Next.js, elle est construite sur une architecture **Vite + React (SPA) + Express** :

- **Frontend** : React 18, Vite, React Router DOM, Tailwind CSS, shadcn/ui (Lucide Icons), React Hook Form, Zod.
- **Backend** : Node.js, Express, Prisma ORM.
- **Base de données** : PostgreSQL (Neon.tech recommandé).
- **Stockage Images** : Cloudinary.
- **Authentification** : JWT (JSON Web Tokens) & bcryptjs.

## 🚀 Installation en local

### 1. Prérequis
- Node.js (v18 ou supérieur)
- Une base de données PostgreSQL locale ou distante (ex: Neon.tech)
- Un compte Cloudinary

### 2. Cloner le projet et installer les dépendances
```bash
npm install
```

### 3. Variables d'environnement
Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` (s'il existe) ou ajoutez les variables suivantes :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tbm"
JWT_SECRET="votre_secret_jwt_tres_securise"
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"

# Optionnel : Configuration SMTP pour les emails
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASS="password"
```

### 4. Base de données (Prisma)
Synchronisez le schéma Prisma avec votre base de données :
```bash
npx prisma db push
```

Générez le client Prisma :
```bash
npx prisma generate
```

Créez le premier compte administrateur :
```bash
npm run prisma:seed
# ou
npx tsx prisma/seed.ts
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000`.

## 📦 Commandes NPM

- `npm run dev` : Lance le serveur de développement (Frontend + Backend via `tsx server.ts`).
- `npm run build` : Compile le frontend React via Vite dans le dossier `/dist`.
- `npm run start` : Lance le serveur en mode production (sert les fichiers statiques de `/dist` et l'API).
- `npm run lint` : Vérifie les erreurs TypeScript.

## 📂 Structure du projet

- `/src/components` : Composants React réutilisables (UI, Layout, Admin).
- `/src/pages` : Pages de l'application (Accueil, Catalogue, Détail, Admin).
- `/src/lib` : Utilitaires (Prisma client, configuration Cloudinary, requêtes DB).
- `/src/context` : Contextes React (ex: ToastContext pour les notifications).
- `/prisma` : Schéma de la base de données et script de seed.
- `/server.ts` : Point d'entrée du backend Express.

## 📝 Crédits

Développé pour **TBM Occasions** (Sainte-Clotilde, La Réunion).
