import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    console.log("API: /api/transactions GET called");
    
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user');
        
        console.log(`API: Fetching transactions for user ID: ${userId}`);
        
        if (!userId) {
            console.log("API: Missing user ID in transactions request");
            return NextResponse.json(
                { message: "User ID is required", success: false },
                { status: 400 }
            );
        }
        
        // Make sure userId is a valid number
        const userIdNum = Number(userId);
        if (isNaN(userIdNum)) {
            console.log(`API: Invalid user ID format: ${userId}`);
            return NextResponse.json(
                { message: "Invalid user ID format", success: false },
                { status: 400 }
            );
        }
        
        // Fetch transactions with error handling
        try {
            console.log(`API: Finding transactions for user ID: ${userIdNum}`);
            const transactions = await prisma.onRampTransaction.findMany({
                where: { userId: userIdNum },
                orderBy: { createdAt: "desc" }
            });
            
            console.log(`API: Found ${transactions.length} transactions`);
            return NextResponse.json({ 
                transactions: transactions,
                success: true
            });
        } catch (dbError) {
            console.error("API: Database error fetching transactions:", dbError);
            return NextResponse.json(
                { 
                    message: "Database error fetching transactions", 
                    error: dbError.message,
                    success: false
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("API: Unexpected error in transactions endpoint:", error);
        return NextResponse.json(
            { 
                message: "Server error processing transaction request", 
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    console.log("API: /api/transactions POST called");
    
    try {
        const body = await request.json();
        const { amount, user, token } = body;
        
        console.log(`API: Creating transaction - Amount: ${amount}, User: ${user}, Token: ${token}`);
        
        if (!amount || !user || !token) {
            console.log("API: Missing required fields in transaction creation");
            return NextResponse.json(
                { message: "Missing required fields", success: false },
                { status: 400 }
            );
        }
        
        // Create transaction with error handling
        try {
            const transaction = await prisma.onRampTransaction.create({
                data: {
                    amount: Number(amount),
                    userId: Number(user),
                    status: "COMPLETED",
                    token: token
                },
            });
            
            console.log(`API: Transaction created successfully with ID: ${transaction.id}`);
            return NextResponse.json({
                message: "Transaction created successfully",
                transaction,
                success: true
            });
        } catch (dbError) {
            console.error("API: Database error creating transaction:", dbError);
            return NextResponse.json(
                { 
                    message: "Database error creating transaction", 
                    error: dbError.message,
                    success: false
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("API: Unexpected error in transaction creation:", error);
        return NextResponse.json(
            { 
                message: "Server error processing transaction creation", 
                error: error.message,
                success: false
            },
            { status: 500 }
        );
    }
}
