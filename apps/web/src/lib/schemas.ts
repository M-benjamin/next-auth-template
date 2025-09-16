import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(1, {
    message: "Password must be at least 1 characters",
  }),
  code: z.optional(z.string()),
});

export const ResetEmailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const CategoryFormSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Category name must be a string",
      required_error: "Category name is required",
    })
    .min(2, {
      message: "Category name must be at least 2 characters long",
    })
    .max(50, {
      message: "Category name must be at most 50 characters long",
    })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message:
        "only  letters, numbers, and spaces are allowed in the category name",
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, "Choose only one category image"),
  url: z
    .string({
      invalid_type_error: "Category url is required",
      required_error: "Category url must be a string",
    })
    .min(2, {
      message: "Category url must be at least 2 characters long",
    })
    .max(50, {
      message: "Category url can not exceed 50 characters",
    })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only  letters, numbers, hyphens, and underscores are allowed in the category url, and  consecutive occurrences of hyphens, underscores,  or spaces  are not permitted",
    }),
  featured: z.boolean().default(false),
});

export type Category = z.infer<typeof CategoryFormSchema>;

export const SubCategoryFormSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Category name must be a string",
      required_error: "Category name is required",
    })
    .min(2, {
      message: "Category name must be at least 2 characters long",
    })
    .max(50, {
      message: "Category name must be at most 50 characters long",
    })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message:
        "only  letters, numbers, and spaces are allowed in the category name",
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, "Choose only one category image"),
  url: z
    .string({
      invalid_type_error: "Category url is required",
      required_error: "Category url must be a string",
    })
    .min(2, {
      message: "Category url must be at least 2 characters long",
    })
    .max(50, {
      message: "Category url can not exceed 50 characters",
    })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only  letters, numbers, hyphens, and underscores are allowed in the category url, and  consecutive occurrences of hyphens, underscores,  or spaces  are not permitted",
    }),
  featured: z.boolean().default(false),
  categoryId: z.string().uuid(),
});

export type SubCategory = z.infer<typeof SubCategoryFormSchema>;
