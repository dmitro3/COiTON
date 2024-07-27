import { supabase } from "@/lib/constants";
import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";

export async function getCurrentUser() {
  try {
    const { data: session, error } = await supabase.auth.getUser();

    if (!session) return null;
    if (error) throw new Error(error.message);

    const user = session?.user;

    const account = {
      id: user?.user_metadata?.sub,
      name: user?.user_metadata?.name,
      email: user?.user_metadata?.email,
      avatar: user?.user_metadata?.avatar,
      address: user?.user_metadata?.address,
      role: user?.role!,
    };

    return account;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function signUp({
  username,
  email,
  password,
  address,
}: {
  username?: string;
  email: string;
  password: string;
  address: string;
}) {
  const avatar = createAvatar(pixelArt, {
    seed: address,
  }).toString();

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: username,
          address,
          avatar,
        },
      },
    });

    if (signUpError) throw new Error(signUpError.message);

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
    await getCurrentUser();
  } catch (error) {
    console.log(error);
    return error;
  }
}
