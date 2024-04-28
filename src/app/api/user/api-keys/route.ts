// External Dependencies

// Relative Dependencies
import { encrypt } from "~/lib/utils";
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { openAIKey, groqKey, userID } = await request.json();

    let { encryptedData: encryptedOpenAIKey, iv: openAIIv } =
      encrypt(openAIKey);
    let { encryptedData: encryptedGroqKey, iv: groqIv } = encrypt(groqKey);

    const user = await db.users.findUnique({
      where: {
        id: userID,
      },
      include: {
        OpenAIKeys: true,
        GroqKeys: true,
      },
    });

    if (!user?.OpenAIKeys?.key) {
      const openaiKeyResponse = await db.openAIKeys.create({
        data: {
          key: encryptedOpenAIKey,
          iv: openAIIv,
          user_id: userID,
        },
      });

      await db.users.update({
        where: {
          id: userID,
        },
        data: {
          openai_key_info: openaiKeyResponse.id,
        },
      });
    } else {
      await db.openAIKeys.update({
        where: {
          id: user?.OpenAIKeys?.id,
        },
        data: {
          key: encryptedOpenAIKey,
          iv: openAIIv,
        },
      });
    }

    if (!user?.GroqKeys?.key) {
      const groqKeyResponse = await db.groqKeys.create({
        data: {
          key: encryptedGroqKey,
          iv: groqIv,
          user_id: userID,
        },
      });

      await db.users.update({
        where: {
          id: userID,
        },
        data: {
          groq_key_info: groqKeyResponse.id,
        },
      });
    } else {
      await db.groqKeys.update({
        where: {
          id: user?.GroqKeys?.id,
        },
        data: {
          key: encryptedGroqKey,
          iv: groqIv,
        },
      });
    }

    return new Response(
      JSON.stringify({ message: "Keys successfully updated" }),
    );
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}