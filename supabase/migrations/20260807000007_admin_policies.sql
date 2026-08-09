-- Acces complet pour les comptes authentifies (equipe Lomdie uniquement, pas d'inscription publique)
-- Si un espace membre client avec son propre login est ajoute plus tard, distinguer via une table de roles
-- plutot que de reutiliser "authenticated" tel quel.

create policy "candidates admin select" on candidates for select to authenticated using (true);
create policy "candidates admin update" on candidates for update to authenticated using (true);
create policy "candidates admin delete" on candidates for delete to authenticated using (true);

create policy "site_content admin write" on site_content for all to authenticated using (true) with check (true);
create policy "testimonials admin write" on testimonials for all to authenticated using (true) with check (true);
create policy "faq_items admin write" on faq_items for all to authenticated using (true) with check (true);
create policy "blog_posts admin write" on blog_posts for all to authenticated using (true) with check (true);
create policy "pricing_plans admin write" on pricing_plans for all to authenticated using (true) with check (true);
create policy "process_steps admin write" on process_steps for all to authenticated using (true) with check (true);
create policy "team_members admin write" on team_members for all to authenticated using (true) with check (true);
create policy "contact_submissions admin select" on contact_submissions for select to authenticated using (true);
create policy "contact_submissions admin update" on contact_submissions for update to authenticated using (true);
