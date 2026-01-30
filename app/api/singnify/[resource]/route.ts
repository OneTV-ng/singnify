import { NextResponse } from 'next/server';
import { singnifyPost } from '@/server/singnify.server';

const MAP: Record<string, string> = {
  songs: '/api/v2/php/get-user-tracks.php',
  albums: '/api/v2/php/get-user-albums.php',
  playlists: '/api/v2/php/get-user-playlists.php',
  likes: '/api/v2/php/get-user-likes.php',
  following: '/api/v2/php/get-user-followed-artists.php',
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Missing token' },
        { status: 401 }
      );
    }

    const { resource } = await params;
    const endpoint = MAP[resource];
    if (!endpoint) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid resource' },
        { status: 404 }
      );
    }

    const data = await singnifyPost(endpoint, token);

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { status: 'error', message: e.message },
      { status: 500 }
    );
  }
}
