import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    const { amount, user } = await request.json();
    try{ 
        const addmoney = await prisma.balance.update({
            where: {"userId": user},
            data: {"amount": {increment: amount}},
        });
        console.log(addmoney);
        return NextResponse.json({message: "Money added successfully"});
    }
    catch(error){
        console.error("Error adding money:", error);
        return NextResponse.json({message: "Money not added", error: error.message}, { status: 500 });
    }
}   

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user');
        
        if(!userId){
            return NextResponse.json({message: "User not found"}, { status: 400 });
        }
        
        const getbalance = await prisma.balance.findMany({
            where: {userId: Number(userId)},
        });
        
        return NextResponse.json({balance: getbalance});
    } catch (error) {
        console.error("Error getting balance:", error);
        return NextResponse.json({message: "Failed to fetch balance", error: error.message}, { status: 500 });
    }
}