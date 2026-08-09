alter table pricing_plans add column if not exists description text;
alter table pricing_plans add column if not exists not_included jsonb not null default '[]';

update pricing_plans set
  description = 'Rejoignez la communauté Lomdie et soyez visible dans notre réseau.',
  not_included = '["Recherche active", "Priorité de traitement", "Accompagnement personnalisé", "Garantie de présentation"]'::jsonb
where tier = 'reseau';

update pricing_plans set
  description = 'Un accompagnement personnalisé pour des rencontres sérieuses et compatibles.'
where tier = 'signature';

update pricing_plans set
  description = 'Une recherche active et élargie pour maximiser vos chances de rencontrer la bonne personne.'
where tier = 'hunter';

notify pgrst, 'reload schema';
