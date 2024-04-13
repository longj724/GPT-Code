// External Dependencies
import { Messages } from "@prisma/client";

// Relative Dependencies
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const newMessage = (await request.json()) as Messages;
    const response = await db.messages.create({
      data: newMessage,
    });

    return new Response(JSON.stringify(response));
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
