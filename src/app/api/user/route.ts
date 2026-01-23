import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../generated/prisma";
import { Role } from "@/app/types";
import { prisma } from "@/app/lib/db";

export async function GET(request: NextRequest) {
    try {
        //check user
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "You are not authorized to access user information" }, { status: 401 });
        }

        //access query parameters
        const searchParams = request.nextUrl.searchParams;
        const teamId = searchParams.get("teamId");
        const role = searchParams.get("role");

        //build the where claues
        const where: Prisma.UserWhereInput = {};


        if (user.role === Role.ADMIN) {
            //Admin can see all users
        } else if (user.role === Role.MANAGER) {
            //Managers can see users in there teams OR cross-team-users but not cross - Managers
            where.OR = [{ teamId: user.teamId }, { role: Role.USER }];


        } else {
            //Regular users can only see users (users and managers) only in their teams
            where.teamId = user.teamId
            where.role = { not: Role.ADMIN }
        }


        //Aditional Filters
        if (teamId) {
            where.teamId = teamId
        }
        if (role) {
            where.role = role as Role
        }

        //query the users 
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true
            },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internel Server Error. Something Went Wrong" }, { status: 500 });
    }
} 

