// External Dependencies

// Relative Dependencies
import OpenAI from "~/lib/OpenAIClient";
import { db } from "~/server/db";

// For GPT 3.5 assistant
const ASSISTANT_ID = "asst_6H3IY3PbORjy4s1mqb9mr4C1";

export async function POST(request: Request) {
  // New Message
  const { message, chatID, projectID } = await request.json();

  const chat = await db.chats.findUnique({
    where: {
      id: chatID,
    },
    include: {
      Models: true,
    },
  });

  const model = await db.models.findUnique({
    where: {
      id: chat?.id,
    },
  });

  const project = await db.projects.findUnique({
    where: {
      id: projectID,
    },
  });

  // Add Project Context to new message

  const projectContext = "";

  // Get context window of model being used

  const remainingTokens = projectContext.length;

  // Subtract message from context window

  // Get all messages and order them by created at date

  // Add as many previous messages as we can

  return new Response("Hello World");
}
