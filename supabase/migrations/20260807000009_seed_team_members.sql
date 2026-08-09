insert into team_members (name, role, bio, sort_order) values
  ('Charlène', 'Fondatrice',
   'À l''origine de Lomdie, portée par la conviction que chaque histoire mérite un accompagnement humain, exigeant et confidentiel.',
   1),
  ('Ivrine', 'Accompagnement & stratégie',
   'Aux côtés de Charlène pour accompagner chaque candidat avec la même exigence de qualité et de bienveillance.',
   2)
on conflict do nothing;
