# Lomdie - état de reprise

## Décisions actives

- Supabase est la source de vérité unique. Airtable est abandonné ; seules les migrations historiques qui décrivent l'import initial sont conservées.
- Le site public et le back-office sont servis par le même projet Next.js 16 sur l'équipe Vercel Lomdie.
- Les prospects simples restent dans **Prospects**, avec ou sans appel découverte.
- Les personnes apparaissent dans **Candidatures** uniquement après l'envoi du dossier détaillé.
- Après paiement, Charlène envoie un seul lien : `/prendre-rendez-vous`. Le candidat complète son dossier puis réserve sur la même page.
- Les profils publics sont anonymisés : aucun nom ni aucune photo.
- Les champs structurés du CRM utilisent des options contrôlées ; les valeurs absentes restent vides.
- La page Newsletter admin liste actuellement les emails collectés sur la homepage, sans outil d'envoi de campagne.

## Architecture

- Next.js 16.3, React 19, App Router, Cache Components.
- Supabase : Postgres, Auth, Storage et RLS.
- Resend : emails transactionnels et SMTP d'authentification.
- Cal.com : réservation et webhook signé, avec Google Meet à configurer dans le compte de Charlène.
- Vercel : équipe `Lomdie`, projet `lomdie-web`, déploiement GitHub depuis `Lomdie/lomdie-web` sur `main`.

## Vérifications avant livraison

1. Préserver les modifications utilisateur déjà présentes dans l'arbre Git.
2. Exécuter lint, TypeScript et build selon le risque.
3. Vérifier le commit exact sur le déploiement Vercel Lomdie.
4. Tester les parcours concernés sur les domaines de production.
5. Contrôler les erreurs runtime après déploiement.

## Documentation durable

- Guide métier : `docs/Lomdie-Guide-Equipe.pdf`
- Reprise technique : `docs/Lomdie-Documentation-Technique.pdf`
- Générateur : `scripts/generate-documentation.py`

Mettre à jour et régénérer ces deux PDF après tout changement important de parcours, d'administration ou d'infrastructure.
