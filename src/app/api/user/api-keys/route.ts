// External Dependencies

// Relative Dependencies
import { encrypt } from "~/lib/security";
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { openAIKey, groqKey, userID } = await request.json();

    const { encryptedData: encryptedOpenAIKey, iv: openaAIIv } =
      encrypt(openAIKey);
    const { encryptedData: encryptedGroqKey, iv: groqIv } = encrypt(groqKey);

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
          key: openAIKey,
          iv: openaAIIv,
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
          key: openAIKey,
          iv: openaAIIv,
        },
      });
    }

    if (!user?.GroqKeys?.key) {
      const groqKeyResponse = await db.groqKeys.create({
        data: {
          key: groqKey,
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
          key: groqKey,
          iv: groqIv,
        },
      });
    }

    return new Response(
      JSON.stringify({ message: "Keys successfully updated" }),
    );
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
