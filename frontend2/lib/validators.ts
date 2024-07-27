import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(4).max(50),
  password: z.string().min(6).max(50),
  address: z.string().min(10).max(50),
});
export const signUpSchema = z.object({
  username: z.string().optional(),
  email: z.string().min(4).max(50),
  password: z.string().min(6).max(50),
  address: z.string().min(10).max(50),
});

export const listingSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().min(5).max(1000),
  location: z.string().min(2),
  // coverImage: z.string(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  state: z.string(),
  city: z.string().optional(),
  price: z.string().min(2),
  // images: z.array(z.string()),
  amenities: z.string(),
  realEstateTypes: z.string(),
});
