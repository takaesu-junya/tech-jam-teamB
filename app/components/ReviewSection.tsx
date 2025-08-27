"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    name: string;
    icon?: string;
    userType: string;
  };
}

interface ReviewSectionProps {
  shopId: string;
  shopName: string;
}

export default function ReviewSection({ shopId, shopName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    rating: 3,
  });
  const [submitting, setSubmitting] = useState(false);

  // 一時的なデモユーザー（実際の実装では認証システムと連携）
  const currentUser = {
    id: 1,
    name: "デモユーザー",
  };

  useEffect(() => {
    fetchReviews();
  }, [shopId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/shops/${shopId}/reviews`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/shops/${shopId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          content: formData.content,
          rating: formData.rating,
          shopName: shopName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReviews([data.review, ...reviews]);
        setFormData({ content: "", rating: 3 });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-500" : "text-gray-600"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400">レビュー</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          {showForm ? "キャンセル" : "レビューを書く"}
        </button>
      </div>

      {/* レビュー投稿フォーム */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 rounded-lg p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              評価
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`text-2xl ${
                    star <= formData.rating ? "text-yellow-500" : "text-gray-600"
                  } hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              レビュー内容
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              placeholder="お店の雰囲気や料理の感想を書いてください..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.content.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </form>
      )}

      {/* レビュー一覧 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>まだレビューがありません</p>
          <p className="text-sm mt-2">最初のレビューを投稿してみましょう！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.user.icon || review.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {review.user.name}
                      {review.user.userType === "meister" && (
                        <span className="ml-2 px-2 py-1 bg-yellow-600 text-xs rounded">
                          マイスター
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}