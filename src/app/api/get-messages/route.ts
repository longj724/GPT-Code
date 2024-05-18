// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function GET(request: Request, response: Response) {
  try {
    // Doing this because request.query is not working for some reason
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const chatID = searchParams.get("chat_id");

    const messages = await db.messages.findMany({
      where: {
        chat_id: chatID!,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return new Response(JSON.stringify({ messages: messages ?? [] }));
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
