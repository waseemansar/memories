import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { z } from "zod";

import AuthForm from "~/components/auth/AuthForm";
import { validateAction } from "~/utils/validation.server";
import { signin, signup } from "~/utils/auth.server";
import { CustomError } from "~/utils/errors";
import { getUserFromSession } from "~/utils/session.server";

export default function Auth() {
    return (
        <main>
            <AuthForm />
        </main>
    );
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUserFromSession(request);
    if (user) {
        throw redirect("/");
    }

    return null;
};

const signinSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

const signupSchema = z
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

type SigninActionInput = z.TypeOf<typeof signinSchema>;
type SignupActionInput = z.TypeOf<typeof signupSchema>;

export const action: ActionFunction = async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const authMode = searchParams.get("mode") || "signin";

    if (authMode === "signin") {
        const { formData, errors } = await validateAction<SigninActionInput>({ request, schema: signinSchema });
        if (errors) {
            return json({ errors }, { status: 422 });
        }

        const { email, password } = formData;
        try {
            return await signin(email, password, "/");
        } catch (error) {
            if (error instanceof CustomError) {
                return json({ errors: { credentials: error.message } });
            }
        }
    } else if (authMode === "signup") {
        const { formData, errors } = await validateAction<SignupActionInput>({ request, schema: signupSchema });
        if (errors) {
            return json({ errors }, { status: 422 });
        }

        const { name, email, password } = formData;
        try {
            await signup(name, email, password);
            return redirect("/auth");
        } catch (error) {
            if (error instanceof CustomError) {
                return json({ errors: { credentials: error.message } });
            }
        }
    }

    return null;
};
