// External Dependencies

// Relative Dependencies
import { encrypt } from "~/lib/utils";
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { openAIKey, geminiKey, userID } = await request.json();

    let { encryptedData: encryptedOpenAIKey } = encrypt(openAIKey);

    const editKeyResponse = await db.users.update({
      where: {
        id: userID,
      },
      data: {
        openai_api_key: encryptedOpenAIKey,
      },
    });

    return new Response(JSON.stringify({ user: editKeyResponse }));
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
