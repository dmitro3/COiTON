import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { supabase } from "@/constants";
import { toast } from "sonner";

export const registerUser = async ({
  name,
  email,
  password,
  address,
}: {
  name: string;
  email: string;
  password: string;
  address: any;
}) => {
  const avatar = createAvatar(adventurerNeutral, {
    seed: `${name + email + address + password}`,
  }).toString();

  try {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_AUTH_REDIRECT}/dashboard`,
        data: {
          name,
          address,
          avatar,
        },
      },
    });

    return result;
  } catch (error: any) {
    toast.error("Something went wrong", {
      description: error?.message,
    });
    console.log(error);
    return error;
  }
};

export const loginUser = async ({
  email,
  password,
  updateCredentials,
}: {
  email: string;
  password: string;
  updateCredentials: (user: any) => void;
}) => {
  try {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.error) {
      throw result.error;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    updateCredentials(data.user);

    return result;
  } catch (error: any) {
    toast.error("Something went wrong", {
      description: error?.message,
    });
    console.log(error);
    return error;
  }
};

export const logoutUser = async (updateCredentials: (user: any) => void) => {
  try {
    const result = await supabase.auth.signOut();
    updateCredentials(null);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};
