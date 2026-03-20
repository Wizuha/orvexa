# Orvexa — Backend API

API REST Node.js/Express pour la plateforme RH B2B Orvexa.

## Stack technique

- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de données** : MongoDB + Mongoose
- **Authentification** : JWT (JSON Web Tokens)
- **Upload de fichiers** : Multer

## Prérequis

- Node.js >= 18
- MongoDB (local ou Atlas)

## Installation

```bash
# 1. Se placer dans le dossier backend
cd backend

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement et le compléter
cp .env.example .env
```

Éditer `.env` avec vos valeurs :

```env
MONGODB_URI=mongodb://localhost:27017/orvexa
JWT_SECRET=votre_cle_secrete_tres_longue
JWT_EXPIRES_IN=7d
PORT=5000
```

## Démarrage

```bash
# Développement (avec rechargement automatique)
npm run dev

# Production
npm start
```

Le serveur démarre sur `http://localhost:5000`.

Vérification : `GET http://localhost:5000/api/health`

---

## Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── db.js               # Connexion MongoDB
│   ├── models/
│   │   ├── User.js             # Modèle utilisateur/auth
│   │   ├── Employee.js         # Modèle employé
│   │   ├── Absence.js          # Modèle demande d'absence
│   │   └── Document.js         # Modèle document RH
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── employee.routes.js
│   │   ├── absence.routes.js
│   │   └── document.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── employee.controller.js
│   │   ├── absence.controller.js
│   │   └── document.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js   # Vérification JWT
│   │   └── role.middleware.js   # Restriction par rôle
│   └── app.js                  # Point d'entrée
├── uploads/                    # Fichiers uploadés
├── .env
├── .env.example
└── package.json
```

---

## Endpoints API

### Authentification

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/auth/register` | Créer un compte | Non |
| POST | `/api/auth/login` | Connexion (retourne JWT) | Non |
| GET | `/api/auth/me` | Profil connecté | Oui |
| PUT | `/api/auth/me` | Modifier profil | Oui |
| PUT | `/api/auth/password` | Changer mot de passe | Oui |

### Employés

| Méthode | Route | Description | Rôle requis |
|---------|-------|-------------|-------------|
| GET | `/api/employees` | Liste tous les employés | RH_ADMIN, MANAGER |
| GET | `/api/employees/stats` | Statistiques dashboard | RH_ADMIN, MANAGER |
| GET | `/api/employees/:id` | Détail d'un employé | Authentifié |
| POST | `/api/employees` | Créer un employé | RH_ADMIN |
| PUT | `/api/employees/:id` | Modifier un employé | RH_ADMIN |
| DELETE | `/api/employees/:id` | Supprimer un employé | RH_ADMIN |

### Absences

| Méthode | Route | Description | Rôle requis |
|---------|-------|-------------|-------------|
| GET | `/api/absences` | Toutes les absences | RH_ADMIN, MANAGER |
| GET | `/api/absences/mine` | Mes absences | Authentifié |
| GET | `/api/absences/:id` | Détail d'une absence | Authentifié |
| POST | `/api/absences` | Créer une demande | Authentifié |
| PUT | `/api/absences/:id/approve` | Approuver | RH_ADMIN, MANAGER |
| PUT | `/api/absences/:id/reject` | Refuser | RH_ADMIN, MANAGER |
| DELETE | `/api/absences/:id` | Supprimer | Authentifié |

### Documents

| Méthode | Route | Description | Rôle requis |
|---------|-------|-------------|-------------|
| GET | `/api/documents` | Documents accessibles | Authentifié |
| GET | `/api/documents/:id` | Détail d'un document | Authentifié |
| POST | `/api/documents` | Uploader un document | RH_ADMIN |
| DELETE | `/api/documents/:id` | Supprimer un document | RH_ADMIN |

---

## Format des réponses

Toutes les réponses suivent ce format JSON standardisé :

```json
{
  "success": true,
  "message": "Description du résultat",
  "data": { ... }
}
```

## Authentification

Inclure le token JWT dans l'en-tête de chaque requête protégée :

```
Authorization: Bearer <votre_token_jwt>
```

## Rôles disponibles

| Rôle | Description |
|------|-------------|
| `RH_ADMIN` | Accès complet à toutes les ressources |
| `MANAGER` | Lecture des employés/absences, approbation des absences |
| `EMPLOYEE` | Accès à son propre profil et ses absences |

## Upload de fichiers

L'endpoint `POST /api/documents` accepte un fichier via `multipart/form-data` avec le champ `file`.

- **Formats acceptés** : PDF, JPG, PNG, DOC, DOCX
- **Taille maximale** : 10 MB
- **Stockage** : dossier `uploads/` (à configurer pour la production)
