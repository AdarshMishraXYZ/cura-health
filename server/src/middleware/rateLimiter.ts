import rateLimit from 'express-rate-limit';

export const triageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 AI triage requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many symptom triage requests from this IP. Please wait a few minutes before trying again.',
  },
});

export const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit booking requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many booking attempts. Please slow down.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Limit login attempts to protect against brute force
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.',
  },
});
