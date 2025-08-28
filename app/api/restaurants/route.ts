import { NextRequest, NextResponse } from "next/server";

const HOTPEPPER_API_KEY = process.env.HOTPEPPER_API_KEY;
const HOTPEPPER_API_URL = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const scene = searchParams.get("scene");
  const id = searchParams.get("id");

  if (!HOTPEPPER_API_KEY) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      key: HOTPEPPER_API_KEY,
      format: "json",
      large_area: "Z098", // 那覇
      count: "30",
    });

    // IDで検索（詳細取得）
    if (id) {
      params.append("id", id);
    } 
    // シーン別検索
    else if (scene) {
      switch (scene) {
        case "party":
          // パーティ向け：個室、コース、飲み放題、大人数収容可能
          params.append("private_room", "1");
          params.append("course", "1");
          params.append("free_drink", "1");
          params.append("party_capacity", "20");
          break;
        case "client":
          // クライアント向け：個室、カード可、高級感
          params.append("private_room", "1");
          params.append("card", "1");
          params.append("budget", "B008"); // 5000円以上
          break;
        case "casual":
          // カジュアル：リーズナブル、賑やか
          params.append("budget", "B003"); // 2001～3000円
          params.append("lunch", "1");
          break;
      }
    }

    const response = await fetch(`${HOTPEPPER_API_URL}?${params}`);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data.results);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}