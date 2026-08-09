alter table pricing_plans add column if not exists price_period text;

update pricing_plans set price = 0, price_period = null where tier = 'reseau';
update pricing_plans set price = 290, price_period = 'pour 3 mois' where tier = 'signature';
update pricing_plans set price = 490, price_period = 'pour 6 mois' where tier = 'hunter';

notify pgrst, 'reload schema';
