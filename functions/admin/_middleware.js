export async function onRequest(context) {
  const { request, env, next } = context;
  const auth = request.headers.get('Authorization');

  if (!auth || !auth.startsWith('Basic ')) {
    return unauthorized();
  }

  let decoded;
  try {
    decoded = atob(auth.slice(6));
  } catch {
    return unauthorized();
  }

  const separatorIndex = decoded.indexOf(':');
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  const expectedUser = env.ADMIN_USERNAME || 'admin';
  if (user !== expectedUser || pass !== env.ADMIN_PASSWORD) {
    return unauthorized();
  }

  return next();
}

function unauthorized() {
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin area"' },
  });
}