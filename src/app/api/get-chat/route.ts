// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function GET(request: Request, response: Response) {
  try {
    // Doing this because request.query is not working for some reason
    const url = new URL(request.url as string);
    const searchParams = new URLSearchParams(url.search);
    const chatID = searchParams.get("chat_id");

    const chat = await db.chats.findUnique({
      where: {
        id: chatID as string,
      },
    });

    return new Response(JSON.stringify({ chat: chat ?? {} }));
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
