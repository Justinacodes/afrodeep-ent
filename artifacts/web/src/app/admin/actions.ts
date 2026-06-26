"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

import { db, promotersTable } from "@workspace/db";
import { revalidatePath } from "next/cache";

export async function createPromoterAction(prevState: { error?: string; success?: boolean; referralCode?: string } | null, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const referralCode = formData.get("referralCode") as string;

  if (!name || !referralCode) {
    return { error: "Name and Referral Code are required." };
  }

  try {
    await db.insert(promotersTable).values({
      name,
      referralCode: referralCode.trim().toUpperCase(),
    });
    
    revalidatePath("/admin");
    return { success: true, referralCode: referralCode.trim().toUpperCase() };
  } catch (err: any) {
    // If there's a unique constraint violation or other error
    return { error: "Failed to create promoter. The referral code might already exist." };
  }
}
