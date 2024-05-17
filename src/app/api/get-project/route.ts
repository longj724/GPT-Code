// External Dependencies

// Relative Dependencies
import { db } from "~/server/db";

export async function GET(request: Request, response: Response) {
  try {
    // Doing this because request.query is not working for some reason
    const url = new URL(request.url as string);
    const searchParams = new URLSearchParams(url.search);
    const userID = searchParams.get("user_id");
    const projectID = searchParams.get("project_id");

    const project = await db.projects.findUnique({
      where: {
        id: projectID as string,
        user_id: userID as string,
      },
    });

    return new Response(JSON.stringify({ project: project ?? "" }));
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
