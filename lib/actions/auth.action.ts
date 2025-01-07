"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignInSchema, SignUpSchema } from "../validations";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const formDataObj = Object.fromEntries(formData.entries());

  const parsedData = SignInSchema.safeParse(formDataObj);

  if (!parsedData.success) {
    redirect("/error");
  }

  const { email, password } = parsedData.data;

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const formDataObj = Object.fromEntries(formData.entries());

  const parsedData = SignUpSchema.safeParse(formDataObj);

  if (!parsedData.success) {
    redirect("/error");
  }

  const { firstName, lastName, username, email, password, avatar } =
    parsedData.data;

  const userMetadata: Record<string, string> = {
    firstName,
    lastName,
    username,
  };

  if (avatar) {
    userMetadata.avatar = avatar;
  }

  const data = {
    email,
    password,
    options: {
      data: userMetadata,
    },
  };

  const { data: authResponse, error: authError } = await supabase.auth.signUp(
    data
  );

  if (authError) {
    redirect("/error");
  }

  const userId = authResponse.user?.id;

  if (!userId) {
    redirect("/error");
  }

  const userTableData = {
    id: userId,
    email,
    firstName,
    lastName,
    username,
    avatar: avatar || null,
  };

  const { error: insertError } = await supabase
    .from("User")
    .insert(userTableData);

  if (insertError) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
