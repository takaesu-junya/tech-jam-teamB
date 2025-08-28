"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  access: string;
  budget?: {
    average?: string;
    name?: string;
  };
  catch: string;
  genre?: {
    name?: string;
    catch?: string;
  };
  photo?: {
    pc?: {
      l?: string;
      m?: string;
    };
  };
  open?: string;
  party_capacity?: number;
  private_room?: string;
  card?: string;
  non_smoking?: string;
  parking?: string;
  visitCounter?: number; // 追加
}

interface ApiResponse {
  shop: Restaurant[];
  results_available: number;
}

function RestaurantsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scene = searchParams.get("scene") || "";
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});

  const sceneInfo = {
    party: {
      title: "Party",
      subtitle: "パーティ向けレストラン",
      gradient: "from-purple-900 to-pink-900",
    },
    client: {
      title: "Client",
      subtitle: "クライアント接待向けレストラン",
      gradient: "from-blue-900 to-cyan-900",
    },
    casual: {
      title: "Casual",
      subtitle: "カジュアルダイニング",
      gradient: "from-green-900 to-emerald-900",
    },
  };

  const currentScene = sceneInfo[scene as keyof typeof sceneInfo] || sceneInfo.casual;

  useEffect(() => {
    fetchRestaurants();
  }, [scene]);

  const fetchVisitCounts = async (shopIds: string[]) => {
    const counts: Record<string, number> = {};
    for (const id of shopIds) {
      try {
        const response = await fetch(`/api/shops/${id}/visit`);
        const data = await response.json();
        counts[id] = data.visitCounter || 0;
      } catch (error) {
        counts[id] = 0;
      }
    }
    setVisitCounts(counts);
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/restaurants?scene=${scene}`);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }

      const shops = data.shop || [];
      setRestaurants(shops);
      
      // 訪問数を取得
      if (shops.length > 0) {
        fetchVisitCounts(shops.map(s => s.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (id: string) => {
    router.push(`/restaurants/${id}`);
  };

  const handleVisitClick = async (e: React.MouseEvent, shopId: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/shops/${shopId}/visit`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setVisitCounts(prev => ({ 
          ...prev, 
          [shopId]: data.visitCounter 
        }));
      }
    } catch (error) {
      console.error("Visit error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ヘッダー */}
      <header className={`relative bg-gradient-to-r ${currentScene.gradient} py-20`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4">
          <Link
            href="/"
            className="inline-block mb-6 text-gray-300 hover:text-white transition-colors"
          >
            ← 戻る
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            {currentScene.title}
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            {currentScene.subtitle}
          </p>
          <p className="mt-2 text-gray-300">
            那覇エリアで {restaurants.length} 件のレストランが見つかりました
          </p>
        </div>
      </header>

      {/* コンテンツ */}
      <main className="container mx-auto px-4 py-12">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">レストランが見つかりませんでした</p>
          </div>
        )}

        {/* レストランカードグリッド */}
        {!loading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant.id)}
                className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-900/20 group"
              >
                {/* 画像 */}
                <div className="relative h-48 bg-gray-800">
                  {restaurant.photo?.pc?.l ? (
                    <img
                      src={restaurant.photo.pc.l}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-600 text-6xl">🍽️</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* コンテンツ */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {restaurant.name}
                  </h2>

                  {/* ジャンル */}
                  {restaurant.genre?.name && (
                    <span className="inline-block px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 mb-3">
                      {restaurant.genre.name}
                    </span>
                  )}

                  {/* キャッチコピー */}
                  {restaurant.catch && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {restaurant.catch}
                    </p>
                  )}

                  {/* 予算 */}
                  {restaurant.budget?.average && (
                    <div className="flex items-center text-sm text-gray-300 mb-2">
                      <span className="mr-2">💰</span>
                      <span>{restaurant.budget.average}</span>
                    </div>
                  )}

                  {/* アクセス */}
                  <div className="flex items-start text-sm text-gray-400 mb-2">
                    <span className="mr-2 mt-0.5">📍</span>
                    <span className="line-clamp-2">{restaurant.access}</span>
                  </div>

                  {/* 訪問ボタンと回数 */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={(e) => handleVisitClick(e, restaurant.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <span>👣</span>
                      <span>行ったことある</span>
                    </button>
                    <span className="text-gray-400 text-sm">
                      {visitCounts[restaurant.id] || 0}人が訪問
                    </span>
                  </div>

                  {/* 特徴タグ */}
                  <div className="flex flex-wrap gap-2">
                    {restaurant.private_room === "あり" && (
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                        個室
                      </span>
                    )}
                    {restaurant.card === "利用可" && (
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                        カード可
                      </span>
                    )}
                    {restaurant.parking && restaurant.parking !== "なし" && (
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                        駐車場
                      </span>
                    )}
                    {restaurant.non_smoking && restaurant.non_smoking !== "全面喫煙可" && (
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                        禁煙席
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      }
    >
      <RestaurantsList />
    </Suspense>
  );
}