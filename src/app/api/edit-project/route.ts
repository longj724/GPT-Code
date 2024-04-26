// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { name, programmingLanguages, packages, context, projectID } =
      await request.json();

    // TODO: Check if userID is valid

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

    const projectResponse = await db.projects.update({
      where: {
        id: projectID,
      },
      data: {
        name,
        programming_languages: programmingLanguages,
        packages,
        context,
        system_prompt: systemPrompt,
      },
    });

    return new Response(JSON.stringify({ project: projectResponse }));
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
