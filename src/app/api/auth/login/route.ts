import { generateToken, hashpassword, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

//to create USER
export async function POST(request: NextRequest) {
    try {
        //extract credentials from the request
        const { email, password } = await request.json();

        //validate them
        if (!email || !password) {
            return NextResponse.json({
                error: "Email & Password are required"
            }, { status: 400 })
        }
        //fetch user
        const userFromDB = await prisma.user.findUnique({ where: { email }, include: { team: true } })
        if (!userFromDB) {
            return NextResponse.json({
                error: "Invalid Credentials"
            }, { status: 401 })
        }

        //password validation
        const isValidPassword = await verifyPassword(password, userFromDB.password);
        if (!isValidPassword) {
            return NextResponse.json({
                error: "Invalid Credentials"
            }, { status: 401 })
        }

        //token generation
        const token = generateToken(userFromDB.id);

        //response 
        const resonse = NextResponse.json({
            user: {
                id: userFromDB.id,
                email: userFromDB.email,
                name: userFromDB.name,
                role: userFromDB.role,
                teamId: userFromDB.teamId,
                team: userFromDB.team,
                token
            }
        })

        //set the cookie (whenever, we are sending the resonse we will have cookies in that )
        resonse.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60  //(7 days in seconds)
        })

        return resonse

    } catch (error: any) {
        console.error("Registration Failed")
        return NextResponse.json({ error: "Internel Server Error. Something went wrong" }, { status: 500 })
    }
}

