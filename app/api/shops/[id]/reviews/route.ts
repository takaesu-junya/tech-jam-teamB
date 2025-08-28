import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: hotpepperShopId } = await params;

  try {
    const reviews = await prisma.review.findMany({
      where: { hotpepperShopId },
      include: {
        user: {
          select: {
            name: true,
            icon: true,
            userType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "レビューの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: hotpepperShopId } = await params;
  
  try {
    const body = await request.json();
    const { userId, content, rating, shopName } = body;

    if (!userId || !content || !rating || !shopName) {
      return NextResponse.json(
        { error: "必要な情報が不足しています" },
        { status: 400 }
      );
    }

    // レビューを作成
    const review = await prisma.review.create({
      data: {
        userId,
        hotpepperShopId,
        hotpepperShopName: shopName,
        content,
        rating,
      },
      include: {
        user: {
          select: {
            name: true,
            icon: true,
            userType: true,
          },
        },
      },
    });

    // お店が存在しない場合は作成
    await prisma.shop.upsert({
      where: { hotpepperShopId },
      update: {},
      create: { hotpepperShopId },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "レビューの投稿に失敗しました" },
      { status: 500 }
    );
  }
}