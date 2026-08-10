import { Resend } from "resend";
import { getSiteUrl } from "@/lib/site-url";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Lomdie <no-reply@lomdie.com>";
const REPLY_TO = "contact@lomdie.com";
const PRIMARY_COLOR = "#bf7b1f";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function emailLayout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:0;background-color:#f6f1e9;font-family:Georgia,'Times New Roman',serif;color:#2a241d;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f1e9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8ddca;">
            <tr>
              <td style="padding:32px 32px 0;text-align:center;">
                <span style="font-size:22px;letter-spacing:0.08em;color:${PRIMARY_COLOR};font-weight:bold;">LOMDIE</span>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <h1 style="font-size:20px;margin:0 0 16px;color:#2a241d;">${title}</h1>
                <div style="font-size:15px;line-height:1.6;color:#4a4234;font-family:Helvetica,Arial,sans-serif;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="font-size:12px;color:#9a8f78;font-family:Helvetica,Arial,sans-serif;margin:0;">
                  Lomdie — Le service de matchmaking dédié à la diaspora camerounaise en France.<br />
                  <a href="${getSiteUrl()}" style="color:${PRIMARY_COLOR};">${getSiteUrl().replace(/^https?:\/\//, "")}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendEmail(to: string, subject: string, title: string, bodyHtml: string) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      replyTo: REPLY_TO,
      subject,
      html: emailLayout(title, bodyHtml),
    });
  } catch (error) {
    console.error(`sendEmail failed (to: ${to}, subject: ${subject})`, error);
  }
}

export async function sendContactConfirmationEmail(to: string, name: string) {
  await sendEmail(
    to,
    "Nous avons bien reçu votre message",
    `Merci ${escapeHtml(name)} !`,
    `<p>Nous avons bien reçu votre message et notre équipe vous répondra dans les meilleurs délais.</p>
     <p>À très vite,<br />L'équipe Lomdie</p>`
  );
}

export async function sendCandidatureConfirmationEmail(to: string, firstName: string) {
  await sendEmail(
    to,
    "Votre candidature Lomdie a bien été reçue",
    `Merci ${escapeHtml(firstName)} !`,
    `<p>Votre candidature a bien été reçue. Notre équipe l'examine avec attention et vous recontactera prochainement pour la suite du processus.</p>
     <p>À très vite,<br />L'équipe Lomdie</p>`
  );
}

export async function sendDossierConfirmationEmail(to: string, firstName: string) {
  await sendEmail(
    to,
    "Votre dossier Lomdie a bien été reçu",
    `Merci ${escapeHtml(firstName)} !`,
    `<p>Votre dossier de candidature complet a bien été reçu, photos incluses. Charlène l'examine personnellement et revient vers vous rapidement.</p>
     <p>À très vite,<br />L'équipe Lomdie</p>`
  );
}

export async function sendNewsletterConfirmationEmail(to: string) {
  await sendEmail(
    to,
    "Bienvenue dans la newsletter Lomdie",
    "Bienvenue !",
    `<p>Vous êtes désormais inscrit(e) à la newsletter Lomdie. Vous recevrez nos conseils, nos coulisses et nos nouveautés directement dans votre boîte mail.</p>
     <p>À très vite,<br />L'équipe Lomdie</p>`
  );
}
