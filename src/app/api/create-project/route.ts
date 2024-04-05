// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { name, programmingLanguages, packages, context } =
      await request.json();

    let systemPrompt = `
    You are an AI assistant that is helping a software engineer with programming tasks. Engineers will ask you questions 
    and you will provide answers to them and write code for them when needed. The engineer might provide you with
    information about the project they are working on or rules about how they want to you to answer their questions.

    Here is some background information about the project:

    ${programmingLanguages ? `Programming languages used: ${programmingLanguages}` : ""}
    ${packages ? `Packages used: ${packages}` : ""}
    ${context ? `Context: ${context}` : ""}
    `;
    systemPrompt = systemPrompt.replace(/r?\n/g, "");

    const projectResponse = await db.projects.create({
      data: {
        name,
        programming_languages: programmingLanguages,
        packages,
        context,
        system_prompt: systemPrompt,
      },
    });

    const chatResponse = await db.chats.create({
      data: {
        name: "Untitled",
        project_id: projectResponse.id,
        model_id: 1,
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
