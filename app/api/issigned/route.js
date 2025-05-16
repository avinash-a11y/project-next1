// app/api/check-auth/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (session?.user) {
        return NextResponse.json({ issigned: "true" , user: session.user.id , name: session.user.name});
    } else {
        console.log("no session");
        return NextResponse.json({ issigned: "false" });
    }
}
