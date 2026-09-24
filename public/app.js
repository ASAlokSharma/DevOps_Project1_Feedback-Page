import { validateFeedback } from './shared/validate.js';

const $ = (id) => document.getElementById(id);
const form = $('feedback-form');
const FIELDS = ['name', 'email', 'course', 'feedback'];
const btn = $('submit-btn');

const values = () => Object.fromEntries(FIELDS.map((f) => [f, $(f).value.trim()]));

function showError(field, msg) {
  const el = $(`err-${field}`);
  el.textContent = msg || '';
  el.hidden = !msg;
  $(field).classList.toggle('invalid', Boolean(msg));
}
const showAll = (errors) => FIELDS.forEach((f) => showError(f, errors[f]));

// Live feedback: validate a field when the user leaves it, clear the error as they fix it.
for (const f of FIELDS) {
  $(f).addEventListener('blur', () => {
    if (!$(f).value.trim() && !$(f).dataset.touched) return;
    $(f).dataset.touched = '1';
    showError(f, validateFeedback(values()).errors[f]);
  });
  $(f).addEventListener('input', () => {
    if ($(f).classList.contains('invalid')) showError(f, validateFeedback(values()).errors[f]);
  });
}

$('feedback').addEventListener('input', (e) => {
  const n = e.target.value.length;
  $('count').textContent = `${n} / 500`;
  $('count').classList.toggle('warn', n > 450);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  $('form-error').hidden = true;

  const payload = values();
  const { valid, errors } = validateFeedback(payload);
  showAll(errors);
  if (!valid) {
    $(FIELDS.find((f) => errors[f])).focus();
    return;
  }

  btn.disabled = true;
  btn.querySelector('.spinner').hidden = false;
  btn.querySelector('.btn-label').textContent = 'Submitting…';
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status === 400) {
      const body = await res.json().catch(() => ({}));
      showAll(body.errors || {});
      return;
    }
    if (!res.ok) throw new Error('failed');
    form.hidden = true;
    $('success').hidden = false;
  } catch {
    $('form-error').textContent = 'Something went wrong. Please try again.';
    $('form-error').hidden = false;
  } finally {
    btn.disabled = false;
    btn.querySelector('.spinner').hidden = true;
    btn.querySelector('.btn-label').textContent = 'Submit feedback';
  }
});

$('again').addEventListener('click', () => {
  form.reset();
  FIELDS.forEach((f) => { showError(f, ''); delete $(f).dataset.touched; });
  $('count').textContent = '0 / 500';
  $('success').hidden = true;
  form.hidden = false;
  $('name').focus();
});
