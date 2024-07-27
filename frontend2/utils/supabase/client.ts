import { createBrowserClient } from "@supabase/ssr";
import { variables } from "../env";

export const createClient = () =>
  createBrowserClient(variables?.supabaseUrl, variables?.supabaseKey);
