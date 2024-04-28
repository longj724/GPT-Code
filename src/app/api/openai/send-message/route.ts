// External Dependencies
import { Messages } from "@prisma/client";
import { encode } from "gpt-tokenizer";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI as openai } from "openai";

// Relative Dependencies
import { db } from "~/server/db";
import { modelDisplayNameToNameMap, modelNameToIDMap } from "~/lib/utils";

// For GPT 3.5 assistant
const ASSISTANT_ID = "asst_6H3IY3PbORjy4s1mqb9mr4C1";

export async function POST(request: Request) {
  const { message, model, chatID, projectID } = await request.json();

  // Can probably make this more efficient to not udpate a chat and then fetch it again
  const chat = await db.chats.findUnique({
    where: {
      id: chatID,
    },
    include: {
      Models: true,
    },
  });

  if (chat?.model_id !== modelNameToIDMap[model]) {
    await db.chats.update({
      where: {
        id: chatID,
      },
      data: {
        model_id: modelNameToIDMap[model],
      },
    });
  }

  const project = await db.projects.findUnique({
    where: {
      id: projectID,
    },
    include: {
      Users: {
        include: {
          OpenAIKeys: true,
        },
      },
    },
  });

  if (!project?.Users?.OpenAIKeys?.key) {
    return new Response("No OpenAI API Key Added", {
      status: 400,
    });
  }

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
    // TODO: Handle edge case when message is longer than context window
  }

  const projectSystemPromptTokens = encode(project?.system_prompt || "").length;

  tokensUsed += projectSystemPromptTokens;

  if (tokensUsed > contextWindowSize) {
    console.log("Project system prompt too long");
    // TODO: Send without system prompt or handle in some other way
  }

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

  // Put system prompt at the front (this will be the first message)
  messages.unshift({
    role: "system",
    content: project?.system_prompt || "",
  });

  // Put user message at the back (this will be the most recent message)
  messages.push({
    role: "user",
    content: message,
  });

  const OpenAI = new openai({
    apiKey: project?.Users?.OpenAIKeys?.key,
  });

  const completion = await OpenAI.chat.completions.create({
    model: modelDisplayNameToNameMap[model] || "gpt-3.5-turbo",
    messages: messages,
    stream: true,
  });

  const stream = OpenAIStream(completion);

  // Add message to database
  await db.messages.create({
    data: {
      chat_id: chatID,
      type: "user",
      content: message,
    },
  });

  return new StreamingTextResponse(stream);
}
