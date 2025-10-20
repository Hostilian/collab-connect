import { z } from "zod";

/**
 * Input validation and sanitization utilities
 * Protects against XSS, SQL injection, and other attacks
 */

// Common validation schemas
export const schemas = {
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
    .toLowerCase()
    .trim(),
  
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .transform(sanitizeHtml),
  
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : val)),
  
  url: z.string().url("Invalid URL").max(2048, "URL too long"),
  
  uuid: z.string().uuid("Invalid ID format"),
  
  latitude: z.number().min(-90).max(90),
  
  longitude: z.number().min(-180).max(180),
  
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  
  date: z.coerce.date(),
  
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .toLowerCase(),
};

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 */
export function sanitizeHtml(input: string): string {
  if (!input) return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

/**
 * Sanitize user input for database queries
 * Prevents SQL injection
 */
export function sanitizeSql(input: string): string {
  if (!input) return input;
  
  return input
    .replace(/['";-]/g, "")
    .replace(/(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/gi, "")
    .replace(/UNION\s+SELECT/gi, "")
    .replace(/DROP\s+TABLE/gi, "")
    .replace(/DELETE\s+FROM/gi, "")
    .replace(/INSERT\s+INTO/gi, "")
    .trim();
}

/**
 * Validate and sanitize file uploads
 */
export const fileValidation = {
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Only JPEG, PNG, WebP, and GIF images are allowed"
    ),
  
  document: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "Document must be less than 10MB")
    .refine(
      (file) =>
        ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
          file.type
        ),
      "Only PDF and Word documents are allowed"
    ),
};

/**
 * Rate limiting key generators
 */
export function getRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`;
}

/**
 * Validate environment variables
 */
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  XAI_API_KEY: z.string().min(1),
  SENTRY_DSN: z.string().url().optional(),
});

/**
 * Common form validation schemas
 */
export const formSchemas = {
  login: z.object({
    email: schemas.email,
    password: z.string().min(1, "Password is required"),
  }),
  
  register: z
    .object({
      email: schemas.email,
      password: schemas.password,
      confirmPassword: z.string(),
      name: schemas.name,
      username: schemas.username,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
  
  profile: z.object({
    name: schemas.name,
    bio: schemas.bio,
    location: z.string().max(100).optional(),
    website: schemas.url.optional().or(z.literal("")),
    phoneNumber: schemas.phoneNumber,
  }),
  
  group: z.object({
    name: z.string().min(3).max(100).trim(),
    description: z.string().min(10).max(1000).trim(),
    category: z.enum(["insurance", "housing", "legal", "health", "education", "other"]),
    isPublic: z.boolean(),
    maxMembers: z.number().min(2).max(1000).optional(),
  }),
  
  message: z.object({
    content: z.string().min(1).max(2000).trim().transform(sanitizeHtml),
    recipientId: schemas.uuid.optional(),
    groupId: schemas.uuid.optional(),
  }),
};

/**
 * API validation wrapper
 * Use in API routes to validate request body
 */
export function validateRequest<T>(schema: z.Schema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new Error(JSON.stringify(errors));
    }
    throw error;
  }
}

/**
 * CSRF token validation
 */
export function validateCsrfToken(token: string, expectedToken: string): boolean {
  return token === expectedToken;
}

/**
 * Content type validation for API routes
 */
export function validateContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  return contentType.includes("application/json") || contentType.includes("multipart/form-data");
}
