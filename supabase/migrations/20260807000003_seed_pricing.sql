-- Offres de base, tarifs a valider avec Charlene avant mise en ligne definitive (voir PLAN.md)
insert into pricing_plans (tier, name, price, is_popular, features, cta_label, sort_order) values
  ('reseau', 'Lomdie Réseau', null, false,
    '["Accès à notre réseau de profils qualifiés", "Profils vérifiés", "Mises à jour régulières"]'::jsonb,
    'S''inscrire', 1),
  ('signature', 'Lomdie Signature', null, true,
    '["Entretiens personnalisés", "Sélection de profils compatibles", "Mise en relation", "Suivi personnalisé"]'::jsonb,
    'Choisir cette offre', 2),
  ('hunter', 'Lomdie Hunter', null, false,
    '["Recherche personnalisée", "Profils exclusifs", "Mise en relation", "Suivi premium"]'::jsonb,
    'Choisir cette offre', 3)
on conflict (tier) do nothing;
