import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await context.params;
        const currentuser = await getCurrentUser();

        if (!currentuser || !checkUserPermission(currentuser, Role.ADMIN)) {
            return NextResponse.json({ error: "You are not authorized to assign role" }, { status: 401 })
        }

        //prevent users from changing their own role
        if (userId == currentuser.id) return NextResponse.json({ error: "You are not allowed to change your own role" }, { status: 401 })

        // validate the role
        const { role } = await request.json()

        const AvailableRoleTypesToUpdate = [Role.USER, Role.MANAGER]

        if (!AvailableRoleTypesToUpdate.includes(role)) {
            return NextResponse.json({
                error: "Invalid Role Modification"
            }, { status: 403 })
        }

        //update the user with the new teamId
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: role },  //if teamId is there it will update, otherwise it will be null
            include: { team: true }
        })

        //return the response
        return NextResponse.json({ user: updatedUser, message: `User role updated to ${role}` }, { status: 200 })

    } catch (error) {
        console.error("error", error)
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json({ error: "user not found" }, { status: 404 })
        } else {
            return NextResponse.json({ error: "Internel server error, Something went  wrong" }, { status: 404 })
        }
    }
}

