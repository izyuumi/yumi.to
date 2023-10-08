import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { adminSupabase, corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }
    const apiKeyHash = Deno.env.get("API_KEY_HASH");
    if (!apiKeyHash) {
      throw new Error("Missing API_KEY_HASH");
    }

    const { short, link, apiKey } = await req.json();

    if (
      !short ||
      typeof short !== "string" ||
      !link ||
      typeof link !== "string" ||
      !apiKey ||
      typeof apiKey !== "string"
    ) {
      throw new Error("Missing parameters at edge function!");
    }

    if (apiKey !== apiKeyHash) {
      throw new Error("Invalid API key!");
    }

    const supabaseClient = adminSupabase;

    const url = new URL(link);
    if (!url.protocol.includes("http")) {
      throw new Error("Invalid link! Must be a valid URL!");
    }

    const { error } = await supabaseClient.from("shortlinks").insert([
      {
        short,
        link,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return new Response("ok", { headers: corsHeaders });
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
});
