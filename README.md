# Lomdie

Plateforme de matchmaking Lomdie : site public, parcours prospects et candidats, calendrier Cal.com et back-office métier.

## Production

- Site public : `https://lomdie.com`
- Administration : `https://admin.lomdie.com`
- Dépôt : `Lomdie/lomdie-web`
- Hébergement : équipe Vercel **Lomdie**, projet **lomdie-web**
- Backend : Supabase (Postgres, Auth et Storage)

Le déploiement de production est déclenché automatiquement par un push sur `main`. Avant toute action Vercel, vérifier que la cible est bien l'équipe Lomdie et non un compte personnel.

## Développement

```bash
npm install
npm run dev
```

Contrôles avant livraison :

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Les variables locales vivent dans `.env.local` et ne doivent jamais être committées.

## Structure

- `src/app` : routes publiques et administration Next.js App Router.
- `src/components` : composants publics, métier et interface.
- `src/lib/actions` : Server Actions et logique métier.
- `src/lib/supabase` : clients Supabase serveur et navigateur.
- `supabase/migrations` : historique immuable du schéma de production.
- `docs` : guide équipe et documentation technique à conserver.
- `scripts/generate-documentation.py` : source reproductible des deux PDF.

## Documentation

Pour régénérer les documents après une évolution fonctionnelle :

```bash
python scripts/generate-documentation.py
```

- `docs/Lomdie-Guide-Equipe.pdf` : usage quotidien pour Charlène et Ivrine.
- `docs/Lomdie-Documentation-Technique.pdf` : architecture, exploitation et reprise.

Lire `AGENTS.md` avant toute modification : cette version de Next.js comporte des conventions spécifiques documentées localement dans `node_modules/next/dist/docs`.
