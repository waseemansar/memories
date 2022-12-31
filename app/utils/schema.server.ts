import { z } from "zod";

const MAX_FILE_SIZE = 300000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const postSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    message: z.string().min(1, { message: "Message is required" }),
    tags: z.string().min(1, { message: "Tags are required" }),
    selectedFile: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 3MB`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), "Only .jpg, .jpeg, .png and .webp formats are supported"),
});

export const signinSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const signupSchema = z
    .object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().min(1, { message: "Email is required" }),
        password: z.string().min(1, { message: "Password is required" }),
        repeatPassword: z.string().min(1, { message: "Repeat password is required" }),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Password and repeat password must be same",
        path: ["repeatPassword"],
    });

export type PostActionInput = z.TypeOf<typeof postSchema>;
export type SigninActionInput = z.TypeOf<typeof signinSchema>;
export type SignupActionInput = z.TypeOf<typeof signupSchema>;
