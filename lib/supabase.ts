import { createClient } from "@supabase/supabase-js";
import { Database } from "../@types/supabase";
import { CONFIG } from "../config/config";
export const supabase = createClient<Database>(
  CONFIG.SUPABASE.URL,
  CONFIG.SUPABASE.KEY
);
