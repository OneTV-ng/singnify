export async function getDashboardStats(token: string) {
  const res = await fetch('/api/singnify/songs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();
  const tracks = data.result || [];

  let total = 0;
  for (const t of tracks) {
    total += Number(t.no_plays || t.Play || 0);
  }

  return {
    totalStreams: total.toLocaleString(),
    songsUploaded: tracks.length,
    monthlyListeners: Math.floor(total * 0.3).toLocaleString(),
    totalEarnings: `$${(total * 0.003).toFixed(2)}`,
  };
}
