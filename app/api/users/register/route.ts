import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
export async function POST(req: Request) {
  try {
    const { name, email, password, cpHandles } = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: "User already exists" }, { status: 400 });

    // Hash password

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password, cpHandles: { create: cpHandles } },
    });

    return NextResponse.json({ message: "User registered", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
