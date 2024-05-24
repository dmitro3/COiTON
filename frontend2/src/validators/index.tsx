import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .min(3, { message: "Email must contain at least 3 character(s)." })
    .max(50, { message: "Email must contain at most 50 character(s)." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must contain at least 6 character(s)." })
    .max(16, { message: "Password must contain at most 16 character(s)." }),
});

export const signUpSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(5, { message: "Name must contain at least 5 character(s)." })
    .max(30, { message: "Name must contain at most 30 character(s)." }),
  email: z
    .string({ required_error: "Email address is required." })
    .min(3, { message: "Email must contain at least 3 character(s)." })
    .max(50, { message: "Email must contain at most 50 character(s)." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must contain at least 6 character(s)." })
    .max(16, { message: "Password must contain at most 16 character(s)." }),
});
