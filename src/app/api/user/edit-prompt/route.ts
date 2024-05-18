// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { content, promptID } = await request.json();

    const editPromptResponse = await db.prompts.update({
      where: {
        id: promptID,
      },
      data: {
        content,
      },
    });

    return new Response(JSON.stringify({ chat: editPromptResponse }));
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
