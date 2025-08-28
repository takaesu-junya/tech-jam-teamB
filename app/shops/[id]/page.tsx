'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Define the type for the shop details
interface ShopDetail {
  id: string;
  name: string;
  address: string;
  photo: {
    pc: {
      l: string;
    };
  };
  catch: string;
  access: string;
  open: string;
  close: string;
  budget: {
    average: string;
    name: string;
  };
  private_room: string;
  card: string;
  non_smoking: string;
  wifi: string;
  urls: {
    pc: string;
  };
}

export default function ShopDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/shop/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
            setShop(null);
          } else {
            setShop(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl font-semibold">Loading details...</div>;
  }

  if (!shop) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl text-gray-500">Could not load shop details.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-96 w-full">
        <Image src={shop.photo.pc.l} alt={shop.name} layout="fill" objectFit="cover" className="filter brightness-50" />
        <div className="absolute inset-0 flex items-end p-8 sm:p-12">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">{shop.name}</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <p className="text-2xl font-light text-gray-300 mb-6">{shop.catch}</p>
          <div className="space-y-8">
            <InfoSection title="Address" content={shop.address} />
            <InfoSection title="Access" content={shop.access} />
            <InfoSection title="Opening Hours" content={`${shop.open} (Closed: ${shop.close})`} />
            <InfoSection title="Budget" content={`${shop.budget.name} (${shop.budget.average})`} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold">Features</h3>
            <FeatureItem label="Private Room" value={shop.private_room} />
            <FeatureItem label="Card Payment" value={shop.card} />
            <FeatureItem label="Non-Smoking" value={shop.non_smoking} />
            <FeatureItem label="Wi-Fi" value={shop.wifi} />
            <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 mt-6">
              View on HotPepper
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
      <p className="mt-2 text-lg text-gray-200">{content}</p>
    </div>
  );
}

function FeatureItem({ label, value }: { label: string; value: string }) {
  const hasFeature = value.includes('あり') || value.includes('可') || value.includes('歓迎');
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <span className={`font-semibold ${hasFeature ? 'text-green-400' : 'text-red-400'}`}>{value}</span>
    </div>
  );
}
