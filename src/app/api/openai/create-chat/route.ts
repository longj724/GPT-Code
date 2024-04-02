// External Dependencies

// Relative Dependencies
import OpenAI from "~/lib/OpenAIClient";
import { db } from "~/server/db";

export async function POST(request: Request) {
  const { projectID } = await request.json();

  try {
    const response = await db.chats.create({
      data: {
        name: "Untitled",
        project_id: projectID,
      },
    });

    return new Response(JSON.stringify(response));
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
