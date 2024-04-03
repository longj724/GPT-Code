// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { name, programmingLanguages, packages, context } =
      await request.json();
    const projectResponse = await db.projects.create({
      data: {
        name,
        programming_languages: programmingLanguages,
        packages,
        context,
      },
    });

    const chatResponse = await db.chats.create({
      data: {
        name: "Untitled",
        project_id: projectResponse.id,
      },
    });

    return new Response(
      JSON.stringify({ project: projectResponse, chat: chatResponse }),
    );
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
