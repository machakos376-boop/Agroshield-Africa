import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://XXXXX.supabase.co";
const SUPABASE_ANON_KEY = "eyJXXXXXXXXXXXXXXXXXXXX";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
