import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            return NextResponse.json({ error: "You are not Authenticated" }, { status: 401 });
        }
        return NextResponse.json(user)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internel Server Error" }, { status: 500 });
    }
}


