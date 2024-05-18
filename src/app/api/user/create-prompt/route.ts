// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { content, userID } = await request.json();

    const createPromptResponse = await db.prompts.create({
      data: {
        content,
        user_id: userID,
      },
    });

    return new Response(JSON.stringify({ prompt: createPromptResponse }));
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
