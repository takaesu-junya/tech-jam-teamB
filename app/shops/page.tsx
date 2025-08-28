'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ShopList from '../components/ShopList';

// Define the type for the shop object
interface Shop {
  id: string;
  name: string;
  address: string;
  photo: {
    pc: {
      l: string;
    };
  };
}

export default function ShopsPage() {
  const searchParams = useSearchParams();
  const scene = searchParams.get('scene');
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (scene) {
      setLoading(true);
      fetch(`/api/search?scene=${scene}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setShops(data);
          } else {
            setShops([]); // Handle cases where API might not return an array
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [scene]);

  const sceneTitle = scene ? scene.charAt(0).toUpperCase() + scene.slice(1) : 'Restaurants';

  return (
    <div className="min-h-screen bg-black text-white p-8 sm:p-12 md:p-16">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Discover: {sceneTitle}</h1>
        <p className="mt-2 text-lg text-gray-400">Explore the best spots in Naha.</p>
      </header>
      <main>
        {loading ? (
          <div className="text-center text-2xl font-semibold">Searching for the best places...</div>
        ) : shops.length > 0 ? (
          <ShopList shops={shops} />
        ) : (
          <div className="text-center text-xl text-gray-500">No restaurants found for this scene.</div>
        )}
      </main>
    </div>
  );
}
