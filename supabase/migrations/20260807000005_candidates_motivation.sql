alter table candidates add column motivation text;
comment on column candidates.motivation is 'Message de motivation soumis par le candidat lui-meme, distinct de admin_notes (usage interne equipe)';
