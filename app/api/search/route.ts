import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const scene = req.nextUrl.searchParams.get('scene');
  const apiKey = process.env.HOTPEPPER_API_KEY;
  const largeArea = 'Z098'; // Naha

  let searchParams = {};

  switch (scene) {
    case 'party':
      searchParams = { genre: 'G001,G002,G003,G004,G005,G006,G007,G008,G009,G010,G011,G012,G013,G014,G015,G016,G017' }; // Example: Izakaya, etc.
      break;
    case 'client':
      searchParams = { private_room: 1 }; // Example: Private room
      break;
    case 'casual':
      searchParams = { lunch: 1 }; // Example: Lunch available
      break;
    default:
      // No specific params
      break;
  }

  const query = new URLSearchParams({
    key: apiKey!,
    large_area: largeArea,
    format: 'json',
    ...searchParams,
  });

  try {
    const response = await fetch(`https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${query}`);
    const data = await response.json();
    return NextResponse.json(data.results.shop);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
