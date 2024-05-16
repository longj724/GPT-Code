// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { name, chatID, excludePriorMessages } = await request.json();

    const editChatResponse = await db.chats.update({
      where: {
        id: chatID,
      },
      data: {
        exclude_prior_messages: excludePriorMessages,
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
