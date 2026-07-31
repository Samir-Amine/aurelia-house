import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.https://gkfpeqedxehmgjaqwwxf.supabase.co;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZnBlcWVkeGVobWdqYXF3d3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTYyMjgsImV4cCI6MjEwMTA5MjIyOH0.hU2-xAhOWoDJs8BXUMp3o1t8HfXOR7pY8_38r443x-c;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Copy .env.local.example to .env.local and fill in your project values."
  );
}

// Fall back to harmless placeholders so builds (and pages that don't touch
// Supabase) don't crash before .env.local is configured. Real requests will
// simply fail until the real values are set.

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
