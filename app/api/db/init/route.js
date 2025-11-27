import { initializeDatabase } from "@/lib/mysql";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await initializeDatabase();
    return Response.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (err) {
    return Response.json(
      { error: "Failed to initialize database", message: err.message },
      { status: 500 }
    );
  }
}
