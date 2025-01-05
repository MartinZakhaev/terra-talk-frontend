import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password must be less than 50 characters" }),
});

export const SignUpSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(30, { message: "Username cannot exceed 30 characters." })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores.",
      }),
    firstName: z
      .string()
      .min(1, { message: "First name is required." })
      .max(50, { message: "First name cannot exceed 50 characters." })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "First name can only contain letters and spaces.",
      }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required." })
      .max(50, { message: "Last name cannot exceed 50 characters." })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Last name can only contain letters and spaces.",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please provide a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(20, { message: "Password cannot exceed 20 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Password confirmation is required." }),
    avatar: z.string().url({ message: "Invalid URL" }).optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });
