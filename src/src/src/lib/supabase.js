import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lohpzbobelbytzghfijs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaHB6Ym9iZWxieXR6Z2hmaWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzY1ODMsImV4cCI6MjA5NzU1MjU4M30.Z3pUq_9xiI2V4K6hCE7Y0lxpkYPYPeSt_Ncu0bzgNl4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
