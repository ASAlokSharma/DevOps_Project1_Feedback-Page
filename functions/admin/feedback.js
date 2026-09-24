export async function onRequestGet(context) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/feedback?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  return Response.json(data);
}