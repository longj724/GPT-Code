// External Dependencies
import { Messages } from "@prisma/client";
import { encode } from "gpt-tokenizer";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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

  const project = await db.projects.findUnique({
    where: {
      id: projectID,
    },
  });

  const existingMessages = await db.messages.findMany({
    where: {
      chat_id: chatID,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const contextWindowSize = chat?.Models?.context_window || 16385;
  let messages: ChatCompletionMessageParam[] = [];
  let tokensUsed = 0;

  const newMessageTokens = encode(message).length;

  tokensUsed += newMessageTokens;

  if (tokensUsed > contextWindowSize) {
    console.log("Message too long");
    // TODO: Handle edge case when iniital message is too long
  }

  const projectSystemPromptTokens = encode(project?.system_prompt || "").length;

  tokensUsed += projectSystemPromptTokens;

  if (tokensUsed > contextWindowSize) {
    console.log("Project system prompt too long");
    // TODO: Send without system prompt or handle in some other way
  }

  messages.push({
    role: "system",
    content: project?.system_prompt || "",
  });

  let curMessageIndex = 0;
  while (
    tokensUsed < contextWindowSize &&
    existingMessages &&
    curMessageIndex < existingMessages.length
  ) {
    const nextMessage = existingMessages[curMessageIndex];
    const nextMessageTokens = encode((nextMessage as Messages).content).length;

    tokensUsed += nextMessageTokens;

    if (tokensUsed > contextWindowSize) {
      break;
    }
    const messageRole =
      (nextMessage?.type as "user" | "assistant" | "system") || "user";

    messages.unshift({
      role: messageRole,
      content: nextMessage?.content || "",
    });

    curMessageIndex++;
  }

  messages.unshift({
    role: "user",
    content: message,
  });

  const completion = await OpenAI.chat.completions.create({
    model: chat?.Models?.name || "gpt-3.5-turbo",
    messages: messages,
  });

  // Add message to database
  await db.messages.create({
    data: {
      chat_id: chatID,
      type: "user",
      content: message,
    },
  });

  // Add response to database
  await db.messages.create({
    data: {
      chat_id: chatID,
      type: "assistant",
      content: completion.choices[0]?.message?.content ?? "",
    },
  });

  return new Response(
    JSON.stringify({ message: completion.choices[0]?.message?.content ?? "" }),
  );
}
