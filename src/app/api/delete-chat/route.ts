// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { chatID } = await request.json();

    const deleteChatResponse = await db.chats.delete({
      where: {
        id: chatID,
      },
    });

    return new Response(
      JSON.stringify({ message: "Chat deleted successfully" }),
    );
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
