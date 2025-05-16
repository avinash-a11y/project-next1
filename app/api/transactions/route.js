import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user');
    if(!userId){
        return NextResponse.json({message: "User not found"});
    }
    try{
        const transactions = await prisma.onRampTransaction.findMany({
            where: {userId: Number(userId)},
            orderBy: {createdAt: "desc"}
        });
        return NextResponse.json({transactions: transactions});
    }catch(error){
        return NextResponse.json({message: "Error fetching transactions"});
    }
}

export async function POST(request) {
    const { amount, user, token } = await request.json();
    const transaction = await prisma.onRampTransaction.create({
        data: {amount: amount, userId: user , status: "COMPLETED" , token: token},
    });
    return NextResponse.json({message: "Transaction created successfully"});
}
