import { serverSupabaseClient } from "#supabase/server";
import { nanoid } from "nanoid";
import Database from "@/types/supabase";

export default defineEventHandler(async (event) => {
  try {
    const { link, apiKey } = getQuery(event);

    if (
      !link ||
      typeof link !== "string" ||
      !apiKey ||
      typeof apiKey !== "string"
    ) {
      throw new Error("Missing parameters!");
    }

    const url = new URL(link);
    if (!url.protocol.includes("http")) {
      throw new Error("Invalid link! Must be a valid URL!");
    }

    const short = nanoid(6);

    const supabase = await serverSupabaseClient<Database>(event);

    const { data, error } = await supabase.functions.invoke("newShortlink", {
      body: JSON.stringify({
        short,
        link,
        apiKey,
      }),
    });

    console.log({ data, error });

    if (error) {
      throw new Error(error.message);
    }

    return {
      status: 200,
      body: {
        message: "Success! New short URL created!",
        newShortlink: `${process.env.BASE_URL}/${short}`,
      },
    };
  } catch (err) {
    console.error(err);
    let error = err as Error;
    return {
      status: 500,
      body: {
        message: `Error! ${error.message}`,
      },
    };
  }
});