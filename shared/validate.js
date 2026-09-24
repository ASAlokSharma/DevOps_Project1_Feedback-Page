const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFeedback({ name, course, email, feedback }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Name is required.';
  } else if (name.trim().length > 100) {
    errors.name = 'Name must be under 100 characters.';
  }

  if (!course || !course.trim()) {
    errors.course = 'Course is required.';
  } else if (course.trim().length > 100) {
    errors.course = 'Course must be under 100 characters.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!feedback || !feedback.trim()) {
    errors.feedback = 'Feedback is required.';
  } else if (feedback.trim().length > 500) {
    errors.feedback = 'Feedback must be under 500 characters.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}