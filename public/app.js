const form = document.getElementById('feedback-form');
const list = document.getElementById('feedback-list');
const errorEl = document.getElementById('form-error');

async function loadFeedback() {
  const res = await fetch('/api/feedback');
  const data = await res.json();
  list.innerHTML = data.map(f => `
    <li>
      <strong>${escapeHtml(f.name)}</strong> — ${escapeHtml(f.course)}
      <p>${escapeHtml(f.feedback)}</p>
    </li>
  `).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  const payload = {
    name: document.getElementById('name').value.trim(),
    course: document.getElementById('course').value.trim(),
    feedback: document.getElementById('feedback').value.trim(),
  };

  if (!payload.name || !payload.course || !payload.feedback) {
    errorEl.textContent = 'All fields are required.';
    errorEl.hidden = false;
    return;
  }

  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    errorEl.textContent = 'Something went wrong. Please try again.';
    errorEl.hidden = false;
    return;
  }

  form.reset();
  loadFeedback();
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadFeedback();