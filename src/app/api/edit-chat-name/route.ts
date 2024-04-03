// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    console.log("here");
    const { name, chatID } = await request.json();

    const editChatResponse = await db.chats.update({
      where: {
        id: chatID,
      },
      data: {
        name,
      },
    });

    return new Response(JSON.stringify({ chat: editChatResponse }));
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}