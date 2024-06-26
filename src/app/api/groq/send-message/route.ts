// External Dependencies
import { encode } from "gpt-tokenizer";
import { OpenAIStream, StreamingTextResponse } from "ai";
import Groq from "groq-sdk";
import { type CompletionCreateParams } from "groq-sdk/resources/chat/completions.mjs";

// Relative Dependencies
import { db } from "~/server/db";
import { EncryptionData, decrypt } from "~/lib/security";

export async function POST(request: Request) {
  try {
    const { message, modelName, chatID, projectID } = await request.json();

    // Can probably make this more efficient to not udpate a chat and then fetch it again
    const chat = await db.chats.findUnique({
      where: {
        id: chatID,
      },
      include: {
        Models: true,
      },
    });

    if (chat?.model_name !== modelName) {
      await db.chats.update({
        where: {
          id: chatID,
        },
        data: {
          model_name: modelName,
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
            GroqKeys: true,
          },
        },
      },
    });

    if (!project?.Users?.GroqKeys?.key) {
      return new Response("No Groq API Key Added", {
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
    const messages: CompletionCreateParams.Message[] = [];
    let tokensUsed = 0;

    const newMessageTokens = encode(message).length;

    tokensUsed += newMessageTokens;

    if (tokensUsed > contextWindowSize) {
      console.log("Message too long");
      // TODO: Handle edge case when message is longer than context window
    }

    const projectSystemPromptTokens = encode(
      project?.system_prompt || "",
    ).length;

    tokensUsed += projectSystemPromptTokens;

    if (tokensUsed > contextWindowSize) {
      console.log("Project system prompt too long");
      // TODO: Send without system prompt or handle in some other way
    }

    let curMessageIndex = 0;
    while (
      tokensUsed < contextWindowSize &&
      existingMessages &&
      curMessageIndex < existingMessages.length &&
      !chat?.exclude_prior_messages
    ) {
      const nextMessage = existingMessages[curMessageIndex];
      const nextMessageTokens = encode(nextMessage!.content).length;

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

    // const decryptInput: EncryptionData = {
    //   iv: project?.Users?.GroqKeys?.iv,
    //   encryptedData: project?.Users?.GroqKeys?.key,
    // };

    const groq = new Groq({
      apiKey: project?.Users?.GroqKeys?.key,
    });

    const completion = await groq.chat.completions.create({
      model: modelName || "mixtral-8x7b-32768",
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
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
