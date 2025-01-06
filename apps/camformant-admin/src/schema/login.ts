import { z, ZodType } from "zod";

export type LoginProps = {
  email: string;
  password: string;
};

export const UserSchemaLogin: ZodType<LoginProps> = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, { message: "Invalid Password" }),
});
export type ValidFieldNames = "email" | "password";
