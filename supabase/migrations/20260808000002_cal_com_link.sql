update site_content
set
  key = 'rdv.cal_link',
  label = 'Identifiant Cal.com (ex: charlene-lomdie/decouverte, vide = section masquée en attendant)'
where key = 'rdv.calendly_url';
