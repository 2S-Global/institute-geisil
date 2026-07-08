import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Must contain at least one lowercase letter.")
  .regex(/\d/, "Must contain at least one number.")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character.")
  .regex(/^\S*$/, "Spaces are not allowed.");

export const candidateRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date of birth",
    }),
    father_name: z
      .string()
      .min(2, "Father name must be at least 2 characters"),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type CandidateRegisterInput = z.infer<
  typeof candidateRegisterSchema
>;

export const employerRegisterSchema = z
  .object({
    company_type: z
      .string()
      .min(1, "Please select a company type"),
    name: z.string().min(2, "Company name must be at least 2 characters"),
    email: z.string().email("Invalid official email address"),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type EmployerRegisterInput = z.infer<
  typeof employerRegisterSchema
>;

export const instituteRegisterSchema = z
  .object({
    name: z.string().min(2, "Institute name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type InstituteRegisterInput = z.infer<
  typeof instituteRegisterSchema
>;

export interface RegisterFormInput {
  name: string;
  email: string;
  dob?: string;
  father_name?: string;
  phone: string;
  password: string;
  confirm: string;
  company_type?: string;
}