import { validateFeedback } from '../../public/shared/validate.js';

// No public GET: submitted feedback is only readable through the protected /admin area.

export async function onRequestPost(context) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;

  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { valid, errors } = validateFeedback(body);
  if (!valid) {
    return Response.json({ errors }, { status: 400 });
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
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      course: body.course.trim(),
      feedback: body.feedback.trim(),
    }),
  });

  if (!res.ok) {
    return new Response('Failed to save feedback', { status: 500 });
  }
  return new Response('Created', { status: 201 });
}
