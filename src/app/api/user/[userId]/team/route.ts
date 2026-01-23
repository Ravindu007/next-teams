import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await context.params;
        const user = await getCurrentUser();

        if (!user || !checkUserPermission(user, Role.ADMIN)) {
            return NextResponse.json({ error: "You are not authorized to assign team" }, { status: 401 })
        }

        // validate the team
        const { teamId } = await request.json()
        if (teamId) {
            const team = await prisma.team.findUnique({ where: { id: teamId } })

            if (!team) {
                return NextResponse.json({
                    error: "Team Not Found"
                }, { status: 404 })
            }
        }

        //update the user with the new teamId
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { teamId: teamId },  //if teamId is there it will update, otherwise it will be null
            include: { team: true }
        })

        //return the response
        return NextResponse.json({ user: updatedUser, message: teamId ? "User assigned to team" : "user removed from the team" }, { status: 200 })

    } catch (error) {
        console.error("error", error)
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json({ error: "user not found" }, { status: 404 })
        } else {
            return NextResponse.json({ error: "Internel server error, Something went  wrong" }, { status: 404 })
        }
    }
}

