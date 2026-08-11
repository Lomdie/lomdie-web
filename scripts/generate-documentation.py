"""Génère les deux PDF de référence Lomdie à partir de contenu versionné."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
LOGO = ROOT / "public" / "images" / "logo-lomdie.png"

CREAM = colors.HexColor("#FBF6ED")
GOLD = colors.HexColor("#C47A17")
DARK = colors.HexColor("#321D10")
MUTED = colors.HexColor("#6F6258")
LINE = colors.HexColor("#E7D8C4")
WHITE = colors.white


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverEyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=GOLD, alignment=TA_CENTER, spaceAfter=8))
styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=27, leading=32, textColor=DARK, alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle(name="CoverSub", parent=styles["Normal"], fontName="Helvetica", fontSize=12, leading=18, textColor=MUTED, alignment=TA_CENTER, spaceAfter=18))
styles.add(ParagraphStyle(name="H1L", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=20, leading=24, textColor=DARK, spaceBefore=0, spaceAfter=10))
styles.add(ParagraphStyle(name="H2L", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=GOLD, spaceBefore=12, spaceAfter=6, keepWithNext=True))
styles.add(ParagraphStyle(name="BodyL", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=DARK, spaceAfter=7))
styles.add(ParagraphStyle(name="SmallL", parent=styles["BodyText"], fontName="Helvetica", fontSize=8, leading=11, textColor=MUTED))
styles.add(ParagraphStyle(name="CalloutL", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=9.5, leading=14, textColor=DARK, borderColor=GOLD, borderWidth=1, borderPadding=9, backColor=CREAM, spaceBefore=7, spaceAfter=10))
styles.add(ParagraphStyle(name="BulletL", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=DARK, leftIndent=12, firstLineIndent=-8, bulletIndent=0, spaceAfter=4))
styles.add(ParagraphStyle(name="TableHeadL", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=8.3, leading=11, textColor=WHITE))
styles.add(ParagraphStyle(name="TableBodyL", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.2, leading=11, textColor=DARK))


def P(text: str, style: str = "BodyL") -> Paragraph:
    return Paragraph(text, styles[style])


def bullets(items: list[str]) -> list[Paragraph]:
    return [Paragraph(item, styles["BulletL"], bulletText="•") for item in items]


def table(rows: list[list[str]], widths: list[float]) -> Table:
    data = [[P(cell, "TableHeadL") for cell in rows[0]]]
    data += [[P(cell, "TableBodyL") for cell in row] for row in rows[1:]]
    result = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    result.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, CREAM]),
    ]))
    return result


def section(number: str, title: str, body: list) -> list:
    return [P(f"{number}  {title}", "H1L"), *body]


def page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 15 * mm, A4[0] - 18 * mm, 15 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "Lomdie - document interne - août 2026")
    canvas.drawRightString(A4[0] - 18 * mm, 9 * mm, str(doc.page))
    canvas.restoreState()


def cover(title: str, subtitle: str, audience: str) -> list:
    result = [Spacer(1, 25 * mm)]
    if LOGO.exists():
        result += [Image(str(LOGO), width=62 * mm, height=29.6 * mm, hAlign="CENTER"), Spacer(1, 12 * mm)]
    result += [
        P("DOCUMENT INTERNE", "CoverEyebrow"),
        P(title, "CoverTitle"),
        P(subtitle, "CoverSub"),
        Spacer(1, 12 * mm),
        P(audience, "CoverEyebrow"),
        P("Version mise à jour - 11 août 2026", "SmallL"),
        PageBreak(),
    ]
    return result


def build(path: Path, story: list):
    doc = BaseDocTemplate(str(path), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=18 * mm, bottomMargin=20 * mm, title=path.stem, author="Lomdie")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="lomdie", frames=[frame], onPage=page)])
    doc.build(story)


def team_guide() -> list:
    s = cover("Guide de l'espace équipe Lomdie", "Utiliser admin.lomdie.com au quotidien : prospects, candidatures, mises en relation, contenu et newsletter.", "À l'usage de Charlène et Ivrine")
    s += section("01", "Se connecter", [
        P("L'espace équipe est accessible sur <b>https://admin.lomdie.com</b>. Chaque personne utilise son propre compte et son propre mot de passe."),
        P("Ne partagez jamais un mot de passe. Utilisez « Mot de passe oublié ? » pour recevoir un lien personnel de réinitialisation.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("02", "Comprendre les deux parcours", [
        table([
            ["Parcours", "Ce que fait la personne", "Où suivre le dossier"],
            ["Prospect", "Remplit le formulaire simple sur /candidature, puis peut réserver un appel découverte sans remplir le dossier détaillé.", "Page Prospects"],
            ["Candidat après paiement", "Reçoit manuellement le lien unique /prendre-rendez-vous, remplit son dossier complet, ajoute ses photos puis réserve son créneau.", "Page Candidatures"],
        ], [34 * mm, 82 * mm, 43 * mm]),
        P("Règle essentielle : un prospect simple ne doit pas apparaître dans Candidatures. Il y apparaît seulement après l'envoi du dossier détaillé.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("03", "Prospects", [
        P("Cette page regroupe toutes les demandes initiales, avec ou sans appel découverte."),
        *bullets([
            "Rechercher par nom, email ou téléphone.",
            "Filtrer par type de rendez-vous, statut et période.",
            "Voir les coordonnées et le message du prospect.",
            "Rejoindre, reprogrammer ou annuler un rendez-vous lorsque Cal.com fournit le lien.",
            "Supprimer les lignes de test uniquement après vérification.",
        ]),
        P("Les réservations Cal.com sont rattachées automatiquement grâce à l'adresse email utilisée par le prospect.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("04", "Candidatures détaillées", [
        P("Le tableau affiche les dossiers complets. Il est trié par défaut des candidatures les plus récentes aux plus anciennes."),
        *bullets([
            "Utiliser les filtres simples et avancés pour le matching.",
            "Faire défiler horizontalement depuis la barre située au-dessus du tableau.",
            "Cliquer sur une cellule pour lire ou modifier son contenu sans quitter le tableau.",
            "Cliquer sur une photo pour l'agrandir, ou utiliser la fiche complète.",
            "Ajouter, modifier ou supprimer les informations directement sur la ligne.",
            "Ne pas inventer une valeur manquante : laisser le champ vide.",
        ]),
        P("Les champs à choix fermé (genre, situation, statut, offre, visibilité) utilisent des options prédéfinies et non du texte libre.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("05", "Statuts et mises en relation", [
        table([
            ["Statut candidat", "Usage"],
            ["En qualification", "Dossier en cours d'examen."],
            ["Validée", "Profil accepté."],
            ["Payée", "Paiement confirmé."],
            ["En matching", "Recherche active d'une compatibilité."],
            ["Mise en relation", "Présentation à un autre candidat."],
            ["Clôturée", "Suivi terminé."],
        ], [48 * mm, 111 * mm]),
        P("Pour une mise en relation, sélectionnez l'autre personne et indiquez l'étape : proposée, en discussion, rendez-vous prévu, en relation, refusée ou terminée. La relation est visible depuis les deux profils."),
    ]) + [PageBreak()]
    s += section("06", "Le lien unique après paiement", [
        P("Envoyez uniquement <b>https://lomdie.com/prendre-rendez-vous</b> après confirmation du paiement."),
        P("Sur cette page, le candidat complète d'abord le dossier détaillé. Après l'envoi réussi, le calendrier Cal.com s'affiche immédiatement afin qu'il réserve son créneau.", "CalloutL"),
        P("La configuration Google Calendar et Google Meet dans Cal.com est gérée par Charlène. Pour obtenir un lien Google Meet plutôt qu'un lien Cal Video, l'événement Cal.com doit utiliser Google Meet comme lieu de réunion et le calendrier Google doit être connecté."),
    ]) + [PageBreak()]
    s += section("07", "Contenu, offres, blog et équipe", [
        table([
            ["Section", "Actions disponibles"],
            ["Contenu du site", "Modifier les textes publics, champ par champ."],
            ["Témoignages / FAQ", "Ajouter, modifier, publier, masquer ou réordonner."],
            ["Offres", "Modifier prix, période, description et avantages."],
            ["Blog", "Créer, prévisualiser, publier et gérer les images."],
            ["Notre équipe", "Modifier les photos, rôles et biographies publiques."],
            ["Accès admin", "Inviter ou retirer un compte disposant d'un accès complet."],
        ], [48 * mm, 111 * mm]),
        P("Après une modification importante, vérifier la page publique dans un autre onglet.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("08", "Newsletter", [
        P("La page Newsletter affiche les adresses email collectées par le formulaire de la page d'accueil, de la plus récente à la plus ancienne."),
        P("À ce stade, elle sert uniquement de CRM de collecte. Aucun envoi de campagne newsletter n'est encore implémenté.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("09", "Confidentialité et réflexes", [
        *bullets([
            "Les coordonnées, photos, critères, tribus et religions restent strictement internes.",
            "Les cartes publiques ne montrent ni nom ni photo ; elles affichent seulement des informations anonymisées utiles.",
            "Les profils sont visibles publiquement par défaut, mais peuvent être masqués depuis l'admin.",
            "Retirer immédiatement l'accès admin d'une personne qui quitte l'équipe.",
            "Ne jamais envoyer de captures du CRM contenant des données personnelles hors d'un canal autorisé.",
        ]),
    ]) + [PageBreak()]
    s += section("10", "En cas de problème", [
        table([
            ["Situation", "Action"],
            ["Mot de passe oublié", "Utiliser le lien de réinitialisation sur admin.lomdie.com."],
            ["Modification invisible", "Actualiser la page, confirmer l'enregistrement, puis signaler l'URL et l'heure du test."],
            ["Rendez-vous absent", "Vérifier l'adresse email utilisée et le statut du webhook Cal.com."],
            ["Lien visio Cal Video", "Dans Cal.com, connecter Google Calendar et choisir Google Meet comme lieu de l'événement."],
            ["Incident technique", "Transmettre l'URL, l'heure, l'action effectuée et une capture sans données sensibles."],
        ], [52 * mm, 107 * mm]),
    ])
    return s


def technical_guide() -> list:
    s = cover("Documentation technique Lomdie", "Architecture, exploitation et reprise du site public et du back-office.", "À l'usage des développeurs et responsables techniques")
    s += section("01", "Architecture actuelle", [
        table([
            ["Composant", "Rôle"],
            ["Next.js 16.3 / React 19", "Application unique App Router pour lomdie.com et admin.lomdie.com, Cache Components actif."],
            ["Supabase", "Postgres, Auth et Storage. Source de vérité unique ; Airtable est abandonné."],
            ["Vercel", "Projet lomdie-web dans l'équipe Lomdie, déploiement continu depuis GitHub."],
            ["Resend", "Emails transactionnels et SMTP Supabase Auth."],
            ["Cal.com", "Calendrier intégré et webhook signé vers /api/webhooks/cal-com."],
        ], [48 * mm, 111 * mm]),
    ]) + [PageBreak()]
    s += section("02", "Comptes et cibles officielles", [
        *bullets([
            "GitHub : organisation Lomdie, dépôt Lomdie/lomdie-web, branche de production main.",
            "Vercel : équipe Lomdie, projet lomdie-web. Domaines lomdie.com, www.lomdie.com et admin.lomdie.com.",
            "Supabase : organisation et projet Lomdie dédiés, distincts des comptes personnels historiques.",
            "Compte technique commun : developpeur@lomdie.com. Les secrets restent dans les coffres des services, jamais dans ce document.",
        ]),
        P("Toujours vérifier l'organisation et le projet avant toute action. Ne jamais déployer Lomdie vers un espace Vercel personnel.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("03", "Code et déploiement", [
        *bullets([
            "Lire AGENTS.md et la documentation locale de Next.js 16 avant toute modification du rendu ou du cache.",
            "Exécuter npm run lint, npx tsc --noEmit et npm run build selon le risque du changement.",
            "Le push sur main déclenche la production Vercel Lomdie via l'intégration GitHub.",
            "Le fichier local .vercel/project.json doit pointer vers le projet Lomdie officiel ; il est exclu de Git.",
            "Après déploiement, contrôler le commit, l'état READY, les URL réelles et les erreurs d'exécution.",
        ]),
        P("La CLI locale peut rester connectée à un compte personnel. Si elle est utilisée, imposer explicitement la bonne équipe et vérifier .vercel/project.json ; le flux GitHub reste la voie recommandée.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("04", "Parcours métier", [
        table([
            ["Entrée", "Flux de données"],
            ["/candidature", "Crée un candidat au statut nouvelle_candidature. Visible dans Prospects, jamais dans Candidatures détaillées."],
            ["Réservation découverte", "Cal.com envoie le webhook ; la réservation est rapprochée du prospect par email."],
            ["/prendre-rendez-vous", "Après paiement : envoi du dossier complet, photos Storage, changement de statut, puis affichage du calendrier."],
            ["Mise en relation", "candidate_matches relie deux candidats et conserve le statut bidirectionnel."],
            ["Newsletter homepage", "Insère une adresse unique dans newsletter_subscribers ; consultation admin uniquement."],
        ], [48 * mm, 111 * mm]),
    ]) + [PageBreak()]
    s += section("05", "Données principales", [
        table([
            ["Table", "Responsabilité"],
            ["candidates", "Prospects et dossiers détaillés, statut, profil, critères et visibilité."],
            ["candidate_matches", "Paires de candidats, étape de relation et notes."],
            ["calendly_bookings", "Rendez-vous découverte/après paiement et liens de réunion."],
            ["site_content / pricing_plans", "Textes publics et offres administrables."],
            ["testimonials / faq_items / blog_posts", "Contenus éditoriaux structurés."],
            ["team_members", "Équipe publique."],
            ["contact_submissions / newsletter_subscribers", "Messages de contact et emails collectés."],
            ["integration_secrets", "Secret du webhook Cal.com côté serveur uniquement."],
        ], [52 * mm, 107 * mm]),
    ]) + [PageBreak()]
    s += section("06", "Stockage et fichiers", [
        table([
            ["Bucket", "Accès"],
            ["team-photos", "Lecture publique, écriture admin."],
            ["blog-assets", "Lecture publique, écriture admin."],
            ["candidate-photos", "Photos privées des dossiers, URLs signées à durée limitée dans l'admin."],
        ], [48 * mm, 111 * mm]),
        P("Ne jamais rendre candidate-photos public. Les chemins relatifs sont conservés en base et résolus côté serveur pour l'admin.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("07", "Authentification et sécurité", [
        *bullets([
            "Supabase Auth protège /admin via la session serveur.",
            "Tout utilisateur Auth actif dispose actuellement d'un accès admin complet ; il n'existe pas encore de rôles fins.",
            "Les Server Actions admin doivent vérifier l'utilisateur et respecter les politiques RLS.",
            "La service role key reste exclusivement côté serveur pour les formulaires publics et opérations privilégiées.",
            "Les données de religion et de tribu exigent une attention RGPD et la traçabilité du consentement explicite.",
            "Le webhook Cal.com vérifie x-cal-signature-256 avec HMAC SHA-256 avant toute écriture.",
        ]),
    ]) + [PageBreak()]
    s += section("08", "Variables et intégrations", [
        table([
            ["Variable", "Rôle"],
            ["NEXT_PUBLIC_SUPABASE_URL", "URL du projet Supabase officiel."],
            ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Clé publique Supabase."],
            ["SUPABASE_SERVICE_ROLE_KEY", "Accès serveur privilégié, secret."],
            ["RESEND_API_KEY", "Emails transactionnels."],
            ["NEXT_PUBLIC_SITE_URL", "Origine publique utilisée dans les liens."],
            ["CAL_WEBHOOK_SECRET", "Secret optionnel du webhook ; un secret chiffré fonctionnel peut aussi être lu côté serveur."],
        ], [57 * mm, 102 * mm]),
        P("Ne jamais copier les valeurs dans Git, un ticket, une capture ou ce PDF.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("09", "Cache et cohérence", [
        P("Les lectures publiques utilisent Cache Components, cacheLife et cacheTag. Les mutations administratives doivent invalider le tag correspondant."),
        P("Après une migration ou une correction urgente, utiliser revalidateTag(tag, { expire: 0 }) lorsque l'API de cette version l'exige. Un redéploiement ne garantit pas à lui seul l'expiration des données en cache.", "CalloutL"),
        P("Tags courants : team-members, site-content, pricing-plans, testimonials, faq-items, blog-posts et public-profiles."),
    ]) + [PageBreak()]
    s += section("10", "Historique Airtable", [
        P("Airtable a servi de source historique pour l'import initial des adhérents. Les données ont été migrées vers Supabase, y compris les photos vers candidate-photos."),
        P("Airtable n'est plus une dépendance applicative, aucune synchronisation continue n'est attendue et le script ponctuel d'import a été retiré du dépôt. Les migrations SQL historiques restent conservées : elles décrivent le schéma réellement appliqué et ne doivent pas être supprimées.", "CalloutL"),
    ]) + [PageBreak()]
    s += section("11", "Exploitation et reprise", [
        table([
            ["Contrôle", "Attendu"],
            ["Git", "Arbre propre hors changements utilisateur ; commit ciblé sur main."],
            ["Vercel", "Déploiement production READY dans l'équipe Lomdie, commit exact."],
            ["Site public", "Pages principales, formulaire de candidature et newsletter accessibles."],
            ["Admin", "Connexion, Prospects, Candidatures, CRUD, Newsletter et contenu accessibles."],
            ["Cal.com", "Webhook reçu, ligne créée, lien de réunion exploitable."],
            ["Supabase", "Migrations appliquées, RLS actives, Storage conforme."],
            ["Observabilité", "Aucune erreur runtime nouvelle après déploiement."],
        ], [45 * mm, 114 * mm]),
    ]) + [PageBreak()]
    s += section("12", "Limites connues et prochaines étapes", [
        *bullets([
            "La page Newsletter collecte et liste les emails ; l'envoi de campagnes est volontairement hors périmètre actuel.",
            "Google Calendar et Google Meet doivent être finalisés dans le compte Cal.com de Charlène.",
            "Les accès admin sont complets ; ajouter des rôles avant d'ouvrir l'admin à des intervenants externes.",
            "Conserver une procédure de retrait des anciens comptes et projets personnels après confirmation qu'aucun domaine ou secret n'en dépend.",
            "Poursuivre les audits de performance, d'accessibilité et de protection des données sur la production réelle.",
        ]),
    ])
    return s


if __name__ == "__main__":
    DOCS.mkdir(exist_ok=True)
    build(DOCS / "Lomdie-Guide-Equipe.pdf", team_guide())
    build(DOCS / "Lomdie-Documentation-Technique.pdf", technical_guide())
    print("Documentation Lomdie générée dans docs/")
