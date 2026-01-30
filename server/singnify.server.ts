'use server';

const BASE = process.env.SINGNIFY_API_BASE!;
const API_KEY = process.env.SINGNIFY_API_KEY!;

export async function singnifyPost(
  path: string,
  token: string,
  extra?: Record<string, any>
) {
  const form = new FormData();
  form.append('token', token);

  if (extra) {
    Object.entries(extra).forEach(([k, v]) =>
      form.append(k, String(v))
    );
  }

  const res = await fetch(
    `${BASE}${path}?API_KEY=${API_KEY}`,
    {
      method: 'POST',
      body: form,
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Singnify HTTP ${res.status}`);
  }

  const json = await res.json();

  const ok =
    json.status === '200' ||
    json.status === 200 ||
    json.status === 'success';

  if (!ok || json.message !== 'success') {
    throw new Error(json.message || 'Singnify error');
  }

  return json;
}
