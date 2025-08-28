import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: hotpepperShopId } = await params;

  try {
    // お店が存在しない場合は作成、存在する場合はカウンターを増やす
    const shop = await prisma.shop.upsert({
      where: { hotpepperShopId },
      update: {
        visitCounter: {
          increment: 1,
        },
      },
      create: {
        hotpepperShopId,
        visitCounter: 1,
      },
    });

    return NextResponse.json({ 
      success: true,
      visitCounter: shop.visitCounter 
    });
  } catch (error) {
    console.error("Visit counter error:", error);
    return NextResponse.json(
      { error: "訪問記録の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: hotpepperShopId } = await params;

  try {
    const shop = await prisma.shop.findUnique({
      where: { hotpepperShopId },
    });

    return NextResponse.json({ 
      visitCounter: shop?.visitCounter || 0 
    });
  } catch (error) {
    console.error("Get visit counter error:", error);
    return NextResponse.json(
      { error: "訪問数の取得に失敗しました" },
      { status: 500 }
    );
  }
}