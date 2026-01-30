interface FetchUserDataParams {
  session: any;
  tab: string;
  onSetError: (error: string) => void;
  onSetLoading: (loading: boolean) => void;
  onSetMember: (member: any) => void;
  onSetTracks: (tracks: any[]) => void;
  onSetAlbums: (albums: any[]) => void;
  onSetPlaylists: (playlists: any[]) => void;
  onSetLikedItems: (items: any[]) => void;
  onSetFollowing: (following: any[]) => void;
}

export const fetchUserData = async ({
  session,
  tab,
  onSetError,
  onSetLoading,
  onSetMember,
  onSetTracks,
  onSetAlbums,
  onSetPlaylists,
  onSetLikedItems,
  onSetFollowing,
}: FetchUserDataParams) => {
  if (!session) return;

  const token =
    (session as any)?.accessToken ||
    (session as any)?.user?.Token;

  if (!token) {
    onSetError('No auth token');
    return;
  }

  onSetLoading(true);
  onSetError('');

  try {
    const res = await fetch(`/api/singnify/${tab}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (data.status !== '200' && data.status !== 'success') {
      throw new Error(data.message);
    }

    onSetMember(data.member || data.user);

    switch (tab) {
      case 'songs':
        onSetTracks(data.result || []);
        break;
      case 'albums':
        onSetAlbums(data.result || data.albums || []);
        break;
      case 'playlists':
        onSetPlaylists(data.result || []);
        break;
      case 'likes':
        onSetLikedItems(data.result || []);
        break;
      case 'following':
        onSetFollowing(data.result || []);
        break;
    }
  } catch (e: any) {
    onSetError(e.message);
  } finally {
    onSetLoading(false);
  }
};
