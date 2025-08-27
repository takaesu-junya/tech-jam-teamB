import ShopCard from './ShopCard';

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

interface ShopListProps {
  shops: Shop[];
}

export default function ShopList({ shops }: ShopListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}
