export async function onRequestGet(context) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/feedback?select=*&order=created_at.desc&limit=50`,
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

export async function onRequestPost(context) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;
  const body = await context.request.json();

  if (!body.name || !body.course || !body.feedback) {
    return new Response('Missing fields', { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: body.name,
      course: body.course,
      feedback: body.feedback,
    }),
  });

  if (!res.ok) {
    return new Response('Failed to save feedback', { status: 500 });
  }
  return new Response('Created', { status: 201 });
}