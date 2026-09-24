import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFeedback } from '../public/shared/validate.js';

const validSample = {
  name: 'Alex Kim',
  course: 'CS101',
  email: 'alex@niet.co.in',
  feedback: 'Great course, learned a lot.',
};

test('accepts fully valid input', () => {
  const { valid, errors } = validateFeedback(validSample);
  assert.equal(valid, true);
  assert.deepEqual(errors, {});
});

test('rejects malformed emails', () => {
  for (const email of ['plainaddress', '@niet.co.in', 'user name@niet.co.in', 'user@', '']) {
    const { valid, errors } = validateFeedback({ ...validSample, email });
    assert.equal(valid, false, `expected "${email}" to be invalid`);
    assert.ok(errors.email);
  }
});

test('rejects emails from other domains', () => {
  const bad = ['alex@gmail.com', 'alex@niet.com', 'alex@niet.co.in.evil.com',
    'alex@fakeniet.co.in', 'alex@sub.niet.co.in', 'alex@niet.co.in@gmail.com'];
  for (const email of bad) {
    const { valid, errors } = validateFeedback({ ...validSample, email });
    assert.equal(valid, false, `expected "${email}" to be invalid`);
    assert.ok(errors.email);
  }
});

test('accepts @niet.co.in emails, case-insensitive', () => {
  for (const email of ['alex@niet.co.in', 'a.kim+x@niet.co.in', 'ALEX@NIET.CO.IN']) {
    const { valid } = validateFeedback({ ...validSample, email });
    assert.equal(valid, true, `expected "${email}" to be valid`);
  }
});

test('rejects empty required fields', () => {
  const { valid, errors } = validateFeedback({ name: '', course: '', email: '', feedback: '' });
  assert.equal(valid, false);
  for (const f of ['name', 'course', 'email', 'feedback']) assert.ok(errors[f]);
});

test('treats whitespace-only input as empty', () => {
  const { valid, errors } = validateFeedback({ ...validSample, name: '   ' });
  assert.equal(valid, false);
  assert.ok(errors.name);
});

test('rejects over-length fields', () => {
  assert.equal(validateFeedback({ ...validSample, feedback: 'a'.repeat(501) }).valid, false);
  assert.equal(validateFeedback({ ...validSample, name: 'a'.repeat(101) }).valid, false);
  assert.equal(validateFeedback({ ...validSample, course: 'a'.repeat(101) }).valid, false);
});
