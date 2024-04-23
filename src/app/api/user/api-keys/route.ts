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

export async function GET(request: Request) {
  try {
    // Doing this because request.query is not working for some reason
    const url = new URL(request.url as string);
    const searchParams = new URLSearchParams(url.search);
    const userID = searchParams.get("user_id");

    const user = await db.users.findUnique({
      where: {
        id: userID as string,
      },
    });

    return new Response(
      JSON.stringify({ openAIKey: user?.openai_api_key ?? "" }),
    );
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
