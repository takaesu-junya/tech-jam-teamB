import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const apiKey = process.env.HOTPEPPER_API_KEY;

  if (!id) {
    return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
  }

  const query = new URLSearchParams({
    key: apiKey!,
    id: id,
    format: 'json',
  });

  try {
    const response = await fetch(`https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${query}`);
    const data = await response.json();

    if (data.results.shop && data.results.shop.length > 0) {
      return NextResponse.json(data.results.shop[0]);
    } else {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
