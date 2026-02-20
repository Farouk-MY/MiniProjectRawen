# Note Technique - Projet EcoAction

Ce document justifie les choix technologiques et l'architecture mis en œuvre pour le développement de l'application mobile **EcoAction**.

## 1. Architecture & Navigation

L'application utilise **Expo Router**, un système de navigation basé sur la structure des dossiers (`app/`). Ce choix se justifie par :

- **Modularité** : Chaque dossier représente une entité logique (ex: `(auth)`, `(tabs)`, `mission`).
- **Typage Natif** : L'intégration profonde avec TypeScript garantit que les routes et les paramètres sont typés.
- **Simplicité** : La navigation est gérée de manière déclarative, réduisant le code "boilerplate".

## 2. Gestion des Types Complexes

Le projet applique un **typage strict** pour assurer la robustesse du code :

- **Interfaces Centralisées** (`types/index.ts`) : Toutes les entités (Mission, User, Participation) sont définies de manière unique.
- **Génériques API** : Les méthodes globales `apiGet`, `apiPost`, etc., utilisent des génériques pour garantir que les données fetchées correspondent aux interfaces attendues.

## 3. Stratégie de Mise en Cache (TanStack Query)

Pour répondre à la contrainte d'une expérience fluide même avec un réseau instable, **TanStack Query (React Query)** a été choisi :

- **Configuration Dynamique** : Les hooks (`useMissions`, `useParticipations`) utilisent des valeurs de `staleTime` (5 min) et `gcTime` (30 min) adaptées pour minimiser les requêtes réseau répétitives.
- **Fetching Intelligent** : Les données sont servies instantanément depuis le cache tout en étant rafraîchies en arrière-plan.

## 4. Optimistic UI (UX Fluide)

L'une des fonctionnalités avancées implémentées est l'**Optimistic UI** lors de l'inscription à une mission :

- **Réaction Immédiate** : Dès que l'utilisateur clique sur "Participer", l'interface est mise à jour localement (incrémentation des places prises, ajout à la liste "Mes Missions") avant même que le serveur ne réponde.
- **Rollback en Cas d'Erreur** : Si la requête échoue, l'état précédent est automatiquement restauré via le mécanisme de snapshot du cache, évitant toute désynchronisation visuelle pour l'utilisateur.

## 5. Configuration Réseau Dynamique

Pour faciliter les tests sur appareils physiques (iPhone/Android via Expo Go), le client API résout dynamiquement l'URL de base :

- Utilisation de `Constants.expoConfig.hostUri` pour extraire l'IP de la machine de développement.
- Fallbacks sécurisés pour les émulateurs et le web.
