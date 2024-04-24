import { z } from "zod";

export const listingSchema = z.object({
  owner: z.string().max(80),
  description: z.string().min(2).max(1000),
  address: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  postalCode: z.string().min(2),
  price: z.string().min(2),
  images: z.array(z.string()),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export const loginSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});
