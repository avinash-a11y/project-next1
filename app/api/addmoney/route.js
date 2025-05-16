import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db";

export async function POST(request) {
    const { amount, user } = await request.json();
    try{ 
        const addmoney = await prisma.balance.update({
            where: {"userId": user},
            data: {"amount": {increment: amount}},
        });
        console.log(addmoney);
    }
    catch(error){
        console.log(error);
        return NextResponse.json({message: "Money not added"});
        
    }
    return NextResponse.json({message: "Money added successfully"});
}   


export async function GET(request) {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user');
    if(!userId){
        return NextResponse.json({message: "User not found"});
    }
    const getbalance = await prisma.balance.findMany({
        where: {userId: Number(userId)},
    });
    return NextResponse.json({balance: getbalance});
}