import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const body = await request.json();
  const { to, amount, user } = body;
  console.log(to, amount, user);

  try {
    const [touser, fromuser] = await Promise.all([
      prisma.user.findUnique({ where: { number: to } }),
      prisma.user.findUnique({ where: { id: user } }),
    ]);

    if (!touser || !fromuser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (fromuser.balance < amount) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Start atomic transaction
    await prisma.$transaction(async (tx) => {
      await tx.balance.update({
        where: { userId: fromuser.id },

        data: { amount: { decrement: amount } },
      });

      await tx.balance.update({
        where: { userId: touser.id },
        data: { amount: { increment: amount } },
      });
    });
    console.log(Number(-amount))
    console.log(Number(amount))
    console.log(Number(fromuser.id))
    console.log(Number(touser.id))
    await prisma.$transaction(async (tx) => {
        await tx.onRampTransaction.create({
          data: {
            amount: Number(-amount),
            userId: Number(fromuser.id),
            status: "COMPLETED",
            token: Math.random().toString(36).substring(2, 15),
          },
        });
      
    await tx.onRampTransaction.create({
          data: {
            amount: Number(amount),
            userId: Number(touser.id),
            status: "COMPLETED",
            token: Math.random().toString(36).substring(2, 15),
          },
        });
      });

    return NextResponse.json({ message: "Transaction completed successfully" });
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
