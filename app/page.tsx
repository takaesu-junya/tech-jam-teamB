import Link from 'next/link';

export default function Home() {
  const scenes = [
    { name: 'Party', href: '/shops?scene=party', bgClass: 'bg-party' },
    { name: 'Client', href: '/shops?scene=client', bgClass: 'bg-client' },
    { name: 'Casual', href: '/shops?scene=casual', bgClass: 'bg-casual' },
  ];

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {scenes.map((scene) => (
        <Link href={scene.href} key={scene.name} className={`group relative flex-1 flex items-center justify-center text-white text-4xl font-bold transition-all duration-500 ease-in-out hover:flex-[1.5]`}>
          <div className={`absolute inset-0 ${scene.bgClass} bg-cover bg-center filter grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out`}></div>
          <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-30 transition-all duration-500 ease-in-out"></div>
          <h2 className="z-10 transform group-hover:scale-110 transition-transform duration-500">{scene.name}</h2>
        </Link>
      ))}
    </main>
  );
}
