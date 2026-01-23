import { generateToken, hashpassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

//to create USER
export async function POST(request: NextRequest) {
    try {
        //extract data to create a user from the request
        const { name, email, password, teamCode } = await request.json();

        //validate them
        if (!name || !email || !password) {
            return NextResponse.json({
                error: "Name, Email & Password are required"
            }, { status: 400 })
        }
        //check user existance
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({
                error: "User already exists with that email"
            }, { status: 409 })
        }

        //find the team
        let teamId: string | undefined;
        if (teamCode) {
            const team = await prisma.team.findUnique({ where: { code: teamCode } })

            if (!team) {
                return NextResponse.json({
                    error: "Please enter a valid Team Code"
                }, { status: 400 })
            }
            teamId = team.id
        }


        //creating the user 
        //hashpassword
        const hashedpassword = await hashpassword(password);


        //assign user role [logic: first user that registered becomes ADMIN, others are USERS]
        const userCount = await prisma.user.count();
        const role = userCount == 0 ? Role.ADMIN : Role.USER;

        //create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedpassword,
                role,
                teamId
            }, include: {
                team: true
            }
        })

        //token generation
        const token = generateToken(user.id);

        //response 
        const resonse = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                teamId: user.teamId,
                team: user.team,
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
        console.error("Registration Failed", error)
        return NextResponse.json({ error: "Internel Server Error. Something went wrong" }, { status: 500 })
    }
}

