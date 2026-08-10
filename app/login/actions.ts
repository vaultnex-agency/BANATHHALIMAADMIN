"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.session) {
      return { success: true };
    }

    return { error: "Failed to establish session." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected authentication error occurred.";
    return { error: msg };
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
