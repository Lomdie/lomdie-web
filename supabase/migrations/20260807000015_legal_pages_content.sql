alter table site_content drop constraint site_content_content_type_check;
alter table site_content add constraint site_content_content_type_check
  check (content_type in ('text', 'richtext', 'html', 'image_url'));

insert into site_content (page, key, label, value, content_type) values
  (
    'Confidentialité',
    'confidentialite.content',
    'Contenu de la page',
    '<p>Cette page est en cours de finalisation avec notre équipe juridique. Pour toute question en attendant, contactez-nous directement à contact@lomdie.com.</p>',
    'html'
  ),
  (
    'CGU',
    'cgu.content',
    'Contenu de la page',
    '<p>Cette page est en cours de finalisation avec notre équipe juridique. Pour toute question en attendant, contactez-nous directement à contact@lomdie.com.</p>',
    'html'
  ),
  (
    'Mentions légales',
    'mentions-legales.content',
    'Contenu de la page',
    '<p>Cette page est en cours de finalisation avec notre équipe juridique. Pour toute question en attendant, contactez-nous directement à contact@lomdie.com.</p>',
    'html'
  )
on conflict (key) do nothing;

notify pgrst, 'reload schema';
