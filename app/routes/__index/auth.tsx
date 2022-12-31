import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AuthForm from "~/components/auth/AuthForm";
import { validateAction } from "~/utils/validation.server";
import { googleSignup, signin, signup } from "~/utils/auth.server";
import { CustomError } from "~/utils/errors";
import { getUserFromSession } from "~/utils/session.server";
import { signinSchema, signupSchema } from "~/utils/schema.server";
import type { SigninActionInput, SignupActionInput } from "~/utils/schema.server";
import { useEffect, useState } from "react";
import type { GoogleUserInfo } from "~/types/users";

export default function Auth() {
    const [googleClientId, setGoogleClientId] = useState<string>("");

    useEffect(() => {
        if (window) setGoogleClientId(window.ENV.GOOGLE_CLIENT_ID);
    }, []);

    return (
        <main>
            <GoogleOAuthProvider clientId={googleClientId}>
                <AuthForm />
            </GoogleOAuthProvider>
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
    } else if (authMode === "google") {
        const formData = await request.formData();
        const accessToken = formData.get("accessToken") as string;

        const response = await fetch(process.env.GOOGLE_USER_INFO_API as string, {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        });

        const userInfo: GoogleUserInfo = await response.json();
        if (!userInfo.email) {
            return json({ errors: { credentials: "Cannot get user info from google" } }, { status: 401 });
        }

        try {
            return await googleSignup(userInfo.name, userInfo.email, userInfo.picture, "/");
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) {
                return json({ errors: { credentials: error.message } });
            }
        }
    }

    return null;
};
