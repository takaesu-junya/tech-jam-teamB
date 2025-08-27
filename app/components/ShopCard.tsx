import Image from 'next/image';
import Link from 'next/link';

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

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shops/${shop.id}`} className="block group">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-800">
        <Image
          src={shop.photo.pc.l}
          alt={shop.name}
          width={400}
          height={400}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-100">{shop.name}</h3>
      <p className="mt-1 text-sm text-gray-400">{shop.address}</p>
    </Link>
  );
}
