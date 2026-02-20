# 🌿 EcoAction - Plateforme de Bénévolat Environnemental

EcoAction est une application mobile moderne conçue pour encourager l'engagement citoyen dans des actions environnementales locales. Les utilisateurs peuvent découvrir des missions de bénévolat, s'y inscrire et suivre leur impact écologique.

## ✨ Fonctionnalités

- **Authentification complète** : Inscription et connexion utilisateur (simulée via API).
- **Exploration des missions** :
  - Liste des missions disponibles (fetchées dynamiquement).
  - Filtrage par catégorie (Plages, Arbres, Zéro Déchet, etc.).
  - Recherche textuelle performante.
  - Détails complets : description, date, lieu, places restantes.
- **Gestion des participations** :
  - Inscription aux missions avec **Optimistic UI** pour une réactivité instantanée.
  - Annulation de participation.
  - Vue "Mes Missions" pour la consultation de l'agenda personnel.
- **Profil Utilisateur** : Affichage des statistiques d'impact (missions réalisées, heures, arbres plantés).
- **Gestion intelligente du cache** : Utilisation de TanStack Query pour une expérience fluide même hors-ligne.

## 🛠️ Stack Technique

- **Frontend** : [React Native](https://reactnative.dev/) avec [Expo](https://expo.dev/) (SDK 54).
- **Navigation** : [Expo Router](https://docs.expo.dev/router/introduction/) (système basé sur les fichiers).
- **Styling** : [NativeWind](https://www.nativewind.dev/) (Tailwind CSS pour React Native).
- **Gestion d'état & Cache** : [TanStack Query](https://tanstack.com/query/latest) (v5).
- **Icônes** : [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native).
- **Base de données** : [JSON-Server](https://github.com/typicode/json-server) (API REST simulée).

## 🚀 Installation et Démarrage

### Prérequis

- Node.js (dernière version LTS recommandée)
- Un appareil mobile avec l'app **Expo Go** ou un émulateur (Android/iOS).

### Étapes

1. **Cloner le projet** :

   ```bash
   git clone [url-du-repo]
   cd EcoAction_ReactNative
   ```

2. **Installer les dépendances** :

   ```bash
   npm install
   ```

3. **Lancer le serveur API (JSON-Server)** :
   Dans un terminal séparé :

   ```bash
   npm run server
   ```

   _Note : Le projet détecte automatiquement votre adresse IP LAN pour permettre la connexion depuis un appareil physique._

4. **Démarrer l'application Expo** :
   ```bash
   npx expo start
   ```

## 📱 Développement Cross-Device

L'application intègre une configuration réseau dynamique (`api/client.ts`) qui permet de basculer automatiquement entre :

- `10.0.2.2` pour l'émulateur Android.
- `localhost` pour le web/iOS simulator.
- Votre **IP LAN** pour les tests sur téléphones physiques via Expo Go.
