import { createClient } from "@/lib/supabase/server";

/**
 * Supabase Auth Helper Functions for banath-admin
 */

export async function getCurrentAdminUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Error fetching current admin user:", err);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentAdminUser();
  return !!user;
}
