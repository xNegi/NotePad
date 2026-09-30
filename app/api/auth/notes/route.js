import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const notes = await Note.find({
      userId: user.userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      { notes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get notes error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const note = await Note.create({
      title,
      content,
      userId: user.userId,
    });

    return NextResponse.json(
      {
        message: "Note created successfully",
        note,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create note error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}