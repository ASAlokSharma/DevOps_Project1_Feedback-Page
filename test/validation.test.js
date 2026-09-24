import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFeedback } from '../shared/validate.js';

const validSample = {
  name: 'Alex Kim',
  course: 'CS101',
  email: 'alex@example.com',
  feedback: 'Great course, learned a lot.',
};

test('accepts fully valid input', () => {
  const { valid, errors } = validateFeedback(validSample);
  assert.equal(valid, true);
  assert.deepEqual(errors, {});
});

test('rejects malformed email addresses', () => {
  const badEmails = [
    'plainaddress',
    'missing@domain',
    '@missingusername.com',
    'user@.com',
    'user name@example.com',
    '',
  ];
  for (const email of badEmails) {
    const { valid, errors } = validateFeedback({ ...validSample, email });
    assert.equal(valid, false, `expected "${email}" to be invalid`);
    assert.ok(errors.email, `expected an email error for "${email}"`);
  }
});

test('accepts common valid email formats', () => {
  const goodEmails = ['alex@example.com', 'a.kim+school@uni.edu', 'user@sub.domain.co'];
  for (const email of goodEmails) {
    const { valid, errors } = validateFeedback({ ...validSample, email });
    assert.equal(valid, true, `expected "${email}" to be valid`);
    assert.equal(errors.email, undefined);
  }
});

test('rejects empty required fields', () => {
  const { valid, errors } = validateFeedback({ name: '', course: '', email: '', feedback: '' });
  assert.equal(valid, false);
  assert.ok(errors.name);
  assert.ok(errors.course);
  assert.ok(errors.email);
  assert.ok(errors.feedback);
});

test('treats whitespace-only input as empty', () => {
  const { valid, errors } = validateFeedback({ ...validSample, name: '   ' });
  assert.equal(valid, false);
  assert.ok(errors.name);
});

test('rejects feedback over 500 characters', () => {
  const { valid, errors } = validateFeedback({ ...validSample, feedback: 'a'.repeat(501) });
  assert.equal(valid, false);
  assert.ok(errors.feedback);
});

test('rejects name or course over 100 characters', () => {
  const long = 'a'.repeat(101);
  const byName = validateFeedback({ ...validSample, name: long });
  const byCourse = validateFeedback({ ...validSample, course: long });
  assert.equal(byName.valid, false);
  assert.ok(byName.errors.name);
  assert.equal(byCourse.valid, false);
  assert.ok(byCourse.errors.course);
});