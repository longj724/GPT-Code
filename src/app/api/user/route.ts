// External Dependencies
import { NextApiRequest, NextApiResponse } from "next";

// Relative Dependencies
import { db } from "~/server/db";

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  try {
    // Doing this because request.query is not working for some reason
    const url = new URL(request.url as string);
    const searchParams = new URLSearchParams(url.search);
    const userID = searchParams.get("user_id");

    const user = await db.users.findUnique({
      where: {
        id: userID as string,
      },
      include: {
        OpenAIKeys: true,
        GroqKeys: true,
      },
    });

    return new Response(JSON.stringify({ user: user ?? null }));
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
