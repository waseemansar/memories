import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";

import AuthForm from "~/components/auth/AuthForm";
import { validateAction } from "~/utils/validation.server";

export default function Auth() {
    return (
        <main>
            <AuthForm />
        </main>
    );
}

const signinSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

const signupSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type SigninActionInput = z.TypeOf<typeof signinSchema>;
type SignupActionInput = z.TypeOf<typeof signupSchema>;

export const action: ActionFunction = async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const authMode = searchParams.get("mode") || "signin";

    if (authMode === "signin") {
        const { errors } = await validateAction<SigninActionInput>({ request, schema: signinSchema });
        if (errors) {
            return json({ errors }, { status: 422 });
        }
    } else if (authMode === "signup") {
        const { errors } = await validateAction<SignupActionInput>({ request, schema: signupSchema });
        if (errors) {
            return json({ errors }, { status: 422 });
        }
    }

    return null;
};
