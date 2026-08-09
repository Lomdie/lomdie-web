# Lomdie — plan d'implémentation

Matchmaking haut de gamme pour la diaspora camerounaise. Positionnement : humain, discret, sobre, lumineux. Le critère de réussite numéro un est le style visuel et l'UX, pas seulement la fonctionnalité.

## Stack

- Next.js (App Router, TypeScript) + Tailwind CSS + shadcn/ui, déployé sur Vercel (compte stephanewamba)
- Supabase (Postgres + Auth + Storage) comme base unique, remplace Airtable
- Un seul back-office custom pour Charlène et Ivrine, pas de CMS externe séparé
- Images marketing sourcées via banques gratuites (vraies personnes, jamais des clients), aucune photo sur les cards de la page "Les profils"

## Arborescence du site

Public : Accueil, À propos, Notre méthode, Les profils, Nos offres, Témoignages, FAQ, Blog (+ article), Contact, Candidature, Confidentialité / CGU / Mentions légales.

Post-candidature : Prendre rendez-vous (appel découverte, intégration Calendly plutôt qu'un calendrier maison — évoqué par Charlène dans l'appel, mal transcrit en "urban de calendrier"), Espace membre (phase ultérieure, plus complexe : profils proposés, messagerie, RDV).

Admin (`/admin`, authentifié Supabase) : tableau de bord, contenu du site (blocs éditables par page), témoignages, FAQ, blog, offres/tarifs, candidatures (CRM avec statut de suivi), paramètres.

Arbitrages déjà actés sur le contenu (voir mémoire projet `projet_lomdie_comprehension.md`) :
- Le contenu "mission / valeurs / comparatif / stats / CTA" généré sous le libellé maquette "À propos" est en réalité du contenu d'Accueil.
- À propos se recentre sur l'équipe (pas seulement Charlène).
- Comment ça marche suit les 9 étapes de l'infographie (candidature → validation & paiement → appel vidéo → sélection → présentation de profils → mise en relation → RDV → suivi → belle histoire).
- Aucune photo sur les cards de "Les profils", même pas des photos stock.
- Chiffres et tarifs des maquettes ChatGPT non confirmés à l'oral : à ne pas publier tels quels sans validation de Charlène, remplacés par des placeholders explicites en attendant.

## Modèle de données (Supabase)

`candidates` — remplace la base Airtable. Champs personnels + critères de recherche identiques au formulaire original, plus `status` (nouvelle_candidature / en_qualification / validee / payee / en_matching / mise_en_relation / cloturee), `offer_tier`, `is_publicly_listed`, `sensitive_data_consent` (RGPD, tribu/religion). RLS : lecture/écriture réservée aux comptes admin authentifiés ; la page publique "Les profils" passe par une vue restreinte qui n'expose que prénom, âge, ville, métier des candidats marqués `is_publicly_listed`.

`site_content` — clé/valeur éditable (page, clé, libellé humain, valeur, type) pour les textes de chaque page. C'est le levier de flexibilité principal pour Charlène/Ivrine : elles éditent le texte réel affiché sur le site sans toucher au code.

Tables structurées avec CRUD admin et réordonnancement : `testimonials`, `faq_items`, `blog_posts`, `pricing_plans`, `process_steps`, `team_members`, `contact_submissions`.

`calendly_bookings` — copie légère des RDV confirmés reçus par webhook Calendly (candidate_id, scheduled_at, meeting_link, statut), pour affichage dans le CRM admin sans reconstruire un calendrier maison.

Phase ultérieure : `messages` (espace membre), paiements (Stripe).

## Système visuel

Palette dérivée des maquettes validées par Charlène : fond ivoire/crème, accent doré, texte anthracite chaud, sections sombres ponctuelles pour le contraste (bandeaux CTA). Typographie à deux étages : une serif élégante pour les titres, une sans-serif claire pour le corps de texte. Icônes en trait fin (Lucide), recolorées à la charte. Aucune photo de stock générique sans traitement, sourcing ciblé par thème (couple, portraits, intérieurs chaleureux).

## Phases

1. Design system + scaffolding Next.js/Tailwind/shadcn, premier déploiement Vercel vide pour valider la chaîne
2. Page d'accueil complète (page de référence pour valider le style avant de généraliser)
3. Reste des pages publiques statiques
4. Schéma Supabase + formulaire de candidature connecté
5. Admin : contenu du site, candidatures, témoignages, FAQ, blog, offres
6. Responsive mobile et accessibilité sur l'ensemble, revue finale

## À valider avec Charlène avant mise en ligne définitive

Tarifs des 3 offres, chiffres statistiques (profils qualifiés, entretiens, mises en relation), consentement RGPD spécifique tribu/religion, contenu exact de la page équipe.
