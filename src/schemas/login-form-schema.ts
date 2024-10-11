import { z } from "zod";

export const LoginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }).min(3, {
      message: "Email must be at least 3 characters long.",
    }),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[@#$!%*?&]/, { message: "Password must contain at least one special character." })
  });
  