// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function GET(request: Request, response: Response) {
  try {
    // Doing this because request.query is not working for some reason
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const userID = searchParams.get("user_id");

    const prompts = await db.prompts.findMany({
      where: {
        user_id: userID!,
      },
    });

    return new Response(JSON.stringify({ prompts: prompts ?? [] }));
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
