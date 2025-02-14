import prisma from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken"

export  async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: "enter email and password" })
        }
        const user = await prisma.user.findUnique(
            {where:{email}}
        )
        if (!user) {
            return NextResponse.json({ message: "User not found with this email" })
        }

        if (password != user.password) {
            return NextResponse.json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);

        return NextResponse.json({ message: "Login successfull", token, user }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Internal server error"}, {status:500})
    }
}