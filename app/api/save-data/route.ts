// app/api/save-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "stored-data.json");
const dataDir = path.join(process.cwd(), "data");

type DataToSave = {
  userId: string;
  payload: any;
  testName: any;
};

// Handler for POST requests
export async function POST(request: NextRequest) {
  try {
    const newData: DataToSave = await request.json();

    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (dirError) {
      if ((dirError as NodeJS.ErrnoException).code !== "EEXIST") {
        console.error("Failed to create data directory:", dirError);
        return NextResponse.json(
          {
            success: false,
            message: "Server error: Could not create data directory.",
            error: (dirError as Error).message,
          },
          { status: 500 }
        );
      }
    }

    let existingData: DataToSave[] = [];

    try {
      const fileContent = await fs.readFile(dataFilePath, "utf-8");
      existingData = JSON.parse(fileContent);
      if (!Array.isArray(existingData)) {
        existingData = [];
      }
    } catch (readError) {
      if ((readError as NodeJS.ErrnoException).code !== "ENOENT") {
        console.warn(
          "Error reading existing data file (will overwrite or start fresh):",
          readError
        );
      }
      existingData = [];
    }

    existingData.push(newData);

    await fs.writeFile(
      dataFilePath,
      JSON.stringify(existingData, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Data saved successfully!",
        filePath: dataFilePath,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to save data:", error);
    // Check if the error is due to JSON parsing from request.json()
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload in request body." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Server error: Could not save data.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "Method GET Not Allowed for this endpoint. Use POST.",
    },
    { status: 405, headers: { Allow: "POST" } }
  );
}
