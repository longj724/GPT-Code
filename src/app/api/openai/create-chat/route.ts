// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { projectID } = await request.json();

    const response = await db.chats.create({
      data: {
        name: "Untitled",
        project_id: projectID,
        model_name: "gpt-3.5-turbo",
      },
    });

    return new Response(JSON.stringify(response));
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
