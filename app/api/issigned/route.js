// app/api/check-auth/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("API route /api/issigned called");
        const session = await getServerSession(authOptions);
        
        if (session?.user) {
            console.log("User session found:", session.user.id);
            return NextResponse.json({ issigned: "true", user: session.user.id, name: session.user.name });
        } else {
            console.log("No session found");
            return NextResponse.json({ issigned: "false" });
        }
    } catch (error) {
        console.error("Error in /api/issigned route:", error);
        
        // Return a more informative error
        return NextResponse.json(
            { 
                issigned: "false", 
                error: process.env.NODE_ENV === 'production' 
                    ? 'Server error, please try again' 
                    : error.message 
            }, 
            { status: 500 }
        );
    }
}
