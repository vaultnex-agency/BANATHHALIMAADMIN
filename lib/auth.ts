import { createClient } from "@/lib/supabase/server";

/**
 * Supabase Auth & Authorization Helper Functions for banath-admin
 */

export interface AdminProfile {
  id: string;
  email: string;
  fullName?: string;
  role: string;
}

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

export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  try {
    const user = await getCurrentAdminUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
      };
    }

    // Default admin role fallback for authenticated auth users if profile table trigger was skipped
    return {
      id: user.id,
      email: user.email || "",
      fullName: user.user_metadata?.full_name || "Admin User",
      role: user.user_metadata?.role || "admin",
    };
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentAdminUser();
  return !!user;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentAdminProfile();
  return profile?.role === "admin" || profile?.role === "staff";
}
