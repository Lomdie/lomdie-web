insert into site_content (page, key, label, value, content_type) values
  ('Prendre rendez-vous', 'rdv.calendly_url', 'Lien Calendly (vide = section masquée en attendant)', '', 'text'),
  ('Prendre rendez-vous', 'rdv.header.title', 'Titre de la page', 'Réservez votre appel découverte', 'text'),
  ('Prendre rendez-vous', 'rdv.header.description', 'Sous-titre de la page', 'Un premier échange pour faire connaissance et comprendre vos attentes.', 'richtext')
on conflict (key) do nothing;
