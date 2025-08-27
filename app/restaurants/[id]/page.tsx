"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReviewSection from "@/app/components/ReviewSection";

interface Restaurant {
  id: string;
  name: string;
  name_kana: string;
  address: string;
  access: string;
  mobile_access: string;
  budget?: {
    average?: string;
    name?: string;
    code?: string;
  };
  budget_memo?: string;
  catch: string;
  capacity?: number;
  genre?: {
    name?: string;
    catch?: string;
  };
  photo?: {
    pc?: {
      l?: string;
      m?: string;
      s?: string;
    };
  };
  open?: string;
  close?: string;
  party_capacity?: number;
  wifi?: string;
  wedding?: string;
  course?: string;
  free_drink?: string;
  free_food?: string;
  private_room?: string;
  horigotatsu?: string;
  tatami?: string;
  card?: string;
  non_smoking?: string;
  charter?: string;
  parking?: string;
  barrier_free?: string;
  other_memo?: string;
  lunch?: string;
  midnight?: string;
  shop_detail_memo?: string;
  english?: string;
  pet?: string;
  child?: string;
  urls?: {
    pc?: string;
  };
  coupon_urls?: {
    pc?: string;
    sp?: string;
  };
  lat?: number;
  lng?: number;
  ktai_coupon?: number;
  show?: string;
  karaoke?: string;
  band?: string;
  tv?: string;
}

interface ApiResponse {
  shop: Restaurant[];
}

export default function RestaurantDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchRestaurantDetail();
      fetchVisitCount();
    }
  }, [id]);

  const fetchVisitCount = async () => {
    try {
      const response = await fetch(`/api/shops/${id}/visit`);
      const data = await response.json();
      setVisitCount(data.visitCounter || 0);
    } catch (error) {
      console.error("Failed to fetch visit count:", error);
    }
  };

  const handleVisitClick = async () => {
    try {
      const response = await fetch(`/api/shops/${id}/visit`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setVisitCount(data.visitCounter);
      }
    } catch (error) {
      console.error("Visit error:", error);
    }
  };

  const fetchRestaurantDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/restaurants?id=${id}`);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }

      if (data.shop && data.shop.length > 0) {
        setRestaurant(data.shop[0]);
      } else {
        throw new Error("レストランが見つかりませんでした");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "レストランが見つかりませんでした"}</p>
          <Link
            href="/restaurants"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    { label: "WiFi", value: restaurant.wifi, icon: "📶" },
    { label: "個室", value: restaurant.private_room, icon: "🚪" },
    { label: "掘りごたつ", value: restaurant.horigotatsu, icon: "🪑" },
    { label: "座敷", value: restaurant.tatami, icon: "🏯" },
    { label: "カード払い", value: restaurant.card, icon: "💳" },
    { label: "禁煙・喫煙", value: restaurant.non_smoking, icon: "🚭" },
    { label: "駐車場", value: restaurant.parking, icon: "🚗" },
    { label: "バリアフリー", value: restaurant.barrier_free, icon: "♿" },
    { label: "ランチ", value: restaurant.lunch, icon: "🍱" },
    { label: "深夜営業", value: restaurant.midnight, icon: "🌙" },
    { label: "英語メニュー", value: restaurant.english, icon: "🌐" },
    { label: "ペット可", value: restaurant.pet, icon: "🐕" },
    { label: "お子様連れ", value: restaurant.child, icon: "👶" },
    { label: "コース", value: restaurant.course, icon: "🍽️" },
    { label: "飲み放題", value: restaurant.free_drink, icon: "🍺" },
    { label: "食べ放題", value: restaurant.free_food, icon: "🍴" },
    { label: "貸切", value: restaurant.charter, icon: "🎉" },
    { label: "カラオケ", value: restaurant.karaoke, icon: "🎤" },
    { label: "ライブ・ショー", value: restaurant.show, icon: "🎭" },
    { label: "TV・プロジェクター", value: restaurant.tv, icon: "📺" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ヒーロー画像セクション */}
      <div className="relative h-96 bg-gray-900">
        {restaurant.photo?.pc?.l ? (
          <img
            src={restaurant.photo.pc.l}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-600 text-9xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* ナビゲーション */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => router.back()}
            className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            ← 戻る
          </button>
        </div>

        {/* 店名オーバーレイ */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
          {restaurant.name_kana && (
            <p className="text-gray-300 mb-4">{restaurant.name_kana}</p>
          )}
          {restaurant.genre?.name && (
            <span className="inline-block px-4 py-2 bg-purple-900/50 backdrop-blur-sm rounded-full text-white">
              {restaurant.genre.name}
            </span>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 左側：詳細情報 */}
          <div className="lg:col-span-2 space-y-8">
            {/* キャッチコピー */}
            {restaurant.catch && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">キャッチコピー</h2>
                <p className="text-gray-300 text-lg">{restaurant.catch}</p>
              </div>
            )}

            {/* 基本情報 */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-purple-400">基本情報</h2>
              
              <div className="space-y-4">
                {/* 営業時間 */}
                {restaurant.open && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">⏰</span>
                    <div>
                      <p className="font-semibold text-gray-300">営業時間</p>
                      <p className="text-white mt-1">{restaurant.open}</p>
                      {restaurant.close && (
                        <p className="text-gray-400 mt-1">定休日：{restaurant.close}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 予算 */}
                {restaurant.budget?.average && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">💰</span>
                    <div>
                      <p className="font-semibold text-gray-300">平均予算</p>
                      <p className="text-white mt-1">{restaurant.budget.average}</p>
                      {restaurant.budget_memo && (
                        <p className="text-gray-400 mt-1 text-sm">{restaurant.budget_memo}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 収容人数 */}
                {restaurant.capacity && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">👥</span>
                    <div>
                      <p className="font-semibold text-gray-300">総席数</p>
                      <p className="text-white mt-1">{restaurant.capacity}席</p>
                      {restaurant.party_capacity && (
                        <p className="text-gray-400 mt-1">宴会最大収容人数：{restaurant.party_capacity}名</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 住所 */}
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📍</span>
                  <div>
                    <p className="font-semibold text-gray-300">住所</p>
                    <p className="text-white mt-1">{restaurant.address}</p>
                  </div>
                </div>

                {/* アクセス */}
                <div className="flex items-start">
                  <span className="text-2xl mr-4">🚃</span>
                  <div>
                    <p className="font-semibold text-gray-300">アクセス</p>
                    <p className="text-white mt-1">{restaurant.access}</p>
                    {restaurant.mobile_access && (
                      <p className="text-gray-400 mt-1 text-sm">{restaurant.mobile_access}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 設備・サービス */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-purple-400">設備・サービス</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature) => {
                  if (feature.value && feature.value !== "なし" && feature.value !== "不可") {
                    return (
                      <div
                        key={feature.label}
                        className="bg-gray-800 rounded-lg p-4 flex items-center"
                      >
                        <span className="text-2xl mr-3">{feature.icon}</span>
                        <div>
                          <p className="text-xs text-gray-400">{feature.label}</p>
                          <p className="text-sm text-white">{feature.value}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* その他メモ */}
              {restaurant.other_memo && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300">{restaurant.other_memo}</p>
                </div>
              )}
            </div>

            {/* 詳細メモ */}
            {restaurant.shop_detail_memo && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">備考</h2>
                <p className="text-gray-300">{restaurant.shop_detail_memo}</p>
              </div>
            )}
          </div>

          {/* 右側：予約・クーポン */}
          <div className="space-y-6">
            {/* 訪問ボタン */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">👣 訪問記録</h3>
              <p className="text-gray-300 mb-4">
                {visitCount}人がこのお店を訪問しました
              </p>
              <button
                onClick={handleVisitClick}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg text-white font-semibold transition-colors"
              >
                行ったことある！
              </button>
            </div>
            {/* 予約ボタン */}
            {restaurant.urls?.pc && (
              <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">予約する</h3>
                <a
                  href={restaurant.urls.pc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white text-black py-4 rounded-lg font-bold text-center hover:bg-gray-200 transition-colors"
                >
                  HotPepperで予約 →
                </a>
              </div>
            )}

            {/* クーポン */}
            {(restaurant.coupon_urls?.pc || restaurant.ktai_coupon === 0) && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-yellow-400">🎫 クーポン</h3>
                <p className="text-gray-300 mb-4">お得なクーポンが利用可能です</p>
                {restaurant.coupon_urls?.pc && (
                  <a
                    href={restaurant.coupon_urls.pc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-yellow-500 text-black py-3 rounded-lg font-bold text-center hover:bg-yellow-400 transition-colors"
                  >
                    クーポンを見る
                  </a>
                )}
              </div>
            )}

            {/* 地図 */}
            {restaurant.lat && restaurant.lng && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">📍 地図</h3>
                <a
                  href={`https://www.google.com/maps?q=${restaurant.lat},${restaurant.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-800 py-3 rounded-lg text-center hover:bg-gray-700 transition-colors"
                >
                  Google Mapで見る
                </a>
              </div>
            )}
          </div>
        </div>

        {/* レビューセクション */}
        <div className="mt-12">
          <ReviewSection shopId={id} shopName={restaurant.name} />
        </div>
      </div>
    </div>
  );
}