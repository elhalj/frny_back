# FRNY Backend

Backend de l'application FRNY, une plateforme e-commerce permettant la mise en relation entre vendeurs et acheteurs.

## 🚀 Fonctionnalités

### Authentification

- Système d'inscription et connexion pour les utilisateurs et vendeurs
- Protection des routes avec JWT
- Gestion des sessions avec cookies

### Gestion des Articles

- CRUD complet pour les articles
- Gestion des images avec Cloudinary
- Système de catégorisation
- Gestion des stocks

### Gestion des Commandes

- Création de commandes sécurisées
- Suivi de statut des commandes
- Validation des stocks
- Historique des commandes par utilisateur et par vendeur

### Système de Paiement

- Intégration avec Stripe
- Gestion des transactions sécurisées
- Système de remboursement
- Webhooks pour le suivi des paiements

## 🛠 Technologies Utilisées

- **Node.js & Express.js** - Framework backend
- **MongoDB & Mongoose** - Base de données et ODM
- **JWT** - Authentification
- **Bcrypt** - Hashage des mots de passe
- **Cloudinary** - Gestion des images
- **Stripe** - Système de paiement
- **Dotenv** - Gestion des variables d'environnement

## 📁 Structure du Projet

```
src/
├── controllers/        # Logique métier
├── models/            # Modèles de données
├── middleware/        # Middlewares (auth, validation)
├── routes/           # Définition des routes
├── utils/            # Utilitaires
├── lib/              # Configurations externes
└── index.js          # Point d'entrée
```

## 🔧 Installation

1. Clonez le repository

```bash
git clone https://github.com/elhalj/frny_back.git
cd frny_back
```

2. Installez les dépendances

```bash
npm install
```

3. Configurez les variables d'environnement

```bash
cp .env.example .env
# Remplissez les variables dans .env
```

4. Démarrez le serveur

```bash
npm start
```

## 📝 Modèles de Données

### User

- name
- firstName
- email
- password (hashé)
- address (city, municipality, street)

### Vendor

- name
- firstName
- email
- password (hashé)
- address (city, municipality, number)
- gender
- profilePic

### Article

- name
- price
- details
- category
- stock
- rate
- image
- vendor (référence)

### Order

- user (référence)
- article (référence)
- quantity
- totalPrice
- status
- vendor (référence)

## 🔐 Routes API

### Articles

- `POST /api/article/add` - Ajouter un article (vendeur)
- `GET /api/article/get` - Obtenir tous les articles
- `GET /api/article/getArticle/me` - Obtenir les articles d'un vendeur
- `PUT /api/article/update/:id` - Mettre à jour un article
- `DELETE /api/article/delete/:id` - Supprimer un article

### Commandes

- `POST /api/commande/` - Créer une commande
- `GET /api/commande/user` - Obtenir les commandes d'un utilisateur
- `GET /api/commande/vendor` - Obtenir les commandes d'un vendeur
- `PATCH /api/commande/:id/status` - Mettre à jour le statut d'une commande

### Authentication

- Routes utilisateur: `/api/user/`
- Routes vendeur: `/api/vendor/`

## 🔒 Sécurité

- Authentification JWT
- Protection des routes
- Hashage des mots de passe
- Validation des données
- Gestion sécurisée des paiements
- Protection CORS

## 📈 Améliorations Futures

- [ ] Système de notifications
- [ ] Gestion des retours
- [ ] Système de notation des vendeurs
- [ ] Gestion des promotions
- [ ] Système de recherche avancé

## 📄 Licence

MIT © [elhalj]
