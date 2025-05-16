import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user');
    if(!userId){
        return NextResponse.json({message: "User not found"}, { status: 400 });
    }
    try{
        const transactions = await prisma.onRampTransaction.findMany({
            where: {userId: Number(userId)},
            orderBy: {createdAt: "desc"}
        });
        return NextResponse.json({transactions: transactions});
    }catch(error){
        console.error("Error fetching transactions:", error);
        return NextResponse.json({message: "Error fetching transactions", error: error.message}, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { amount, user, token } = await request.json();
        const transaction = await prisma.onRampTransaction.create({
            data: {amount: amount, userId: user, status: "COMPLETED", token: token},
        });
        return NextResponse.json({message: "Transaction created successfully", transaction});
    } catch (error) {
        console.error("Error creating transaction:", error);
        return NextResponse.json({message: "Error creating transaction", error: error.message}, { status: 500 });
    }
}
