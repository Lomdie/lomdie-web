insert into site_content (page, key, label, value, content_type) values
  ('Accueil', 'home.hero.eyebrow', 'Hero - petit texte au-dessus du titre', 'Matchmaking premium', 'text'),
  ('Accueil', 'home.hero.title', 'Hero - titre principal', 'Créer des rencontres qui ont du sens.', 'text'),
  ('Accueil', 'home.hero.subtitle', 'Hero - sous-titre', 'Lomdie accompagne les célibataires de la diaspora camerounaise en France dans leur recherche d''une relation sérieuse, authentique et durable.', 'richtext'),
  ('À propos', 'a-propos.header.title', 'Titre de la page', 'Des rencontres qui ont du sens', 'text'),
  ('À propos', 'a-propos.header.description', 'Sous-titre de la page', 'Lomdie accompagne les célibataires de la diaspora camerounaise en France dans leur recherche d''une relation sérieuse, authentique et durable.', 'richtext'),
  ('À propos', 'a-propos.story.title', 'Titre du bloc "Notre histoire"', 'Pourquoi Lomdie existe', 'text'),
  ('À propos', 'a-propos.story.body', 'Texte du bloc "Notre histoire"', 'Lomdie est né d''un constat simple : au sein de la diaspora camerounaise, trouver une relation sérieuse relève souvent du parcours du combattant. Les applications généralistes noient les bonnes rencontres sous le bruit, et rien ne remplace le regard humain de quelqu''un qui prend le temps de vous connaître vraiment. Nous avons construit Lomdie pour redonner sa place à l''accompagnement humain dans la recherche amoureuse, avec l''exigence, la discrétion et la sincérité que mérite chaque histoire.', 'richtext'),
  ('Notre méthode', 'methode.header.title', 'Titre de la page', 'Le processus de mise en relation', 'text'),
  ('Notre méthode', 'methode.header.description', 'Sous-titre de la page', 'Un accompagnement humain, personnalisé et confidentiel à chaque étape.', 'richtext')
on conflict (key) do nothing;
