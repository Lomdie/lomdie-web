import type { Metadata } from "next";
import { SetPasswordForm } from "@/components/admin/set-password-form";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default function NouveauMotDePassePage() {
  return <SetPasswordForm />;
}
