"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthedServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

const loginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export interface LoginFormState {
  status: "idle" | "error";
  message?: string;
}

export async function login(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Email ou mot de passe invalide." };
  }

  const supabase = await createAuthedServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { status: "error", message: "Email ou mot de passe incorrect." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createAuthedServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const requestResetSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
});

export interface RequestResetState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const parsed = requestResetSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { status: "error", message: "Adresse email invalide." };
  }

  const supabase = await createAuthedServerClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/admin/nouveau-mot-de-passe`,
  });

  return {
    status: "success",
    message:
      "Si un compte existe avec cette adresse, un email de réinitialisation vient d'être envoyé.",
  };
}

const setPasswordSchema = z
  .object({
    password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export interface SetPasswordState {
  status: "idle" | "error";
  message?: string;
}

export async function setPassword(
  _prevState: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const parsed = setPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Champs invalides.",
    };
  }

  const supabase = await createAuthedServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { status: "error", message: "Impossible de définir le mot de passe." };
  }

  redirect("/admin");
}
