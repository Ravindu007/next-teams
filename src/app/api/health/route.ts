import { checkDatabaseConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
        return NextResponse.json({
            status: "error",
            message: "Database Connection Failed"
        }, { status: 503 })
    } else {
        return NextResponse.json({ status: "success", message: "Database Connected Successfully" }, { status: 200 })
    }
}