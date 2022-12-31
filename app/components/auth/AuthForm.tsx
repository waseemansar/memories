import { Form, Link, useActionData, useFetcher, useSearchParams, useTransition as useNavigation } from "@remix-run/react";
import { FaGoogle, FaLock, FaUserPlus } from "react-icons/fa";
import type { action } from "~/routes/__index/auth";
import { useGoogleLogin } from "@react-oauth/google";

import ErrorMessage from "../ui/ErrorMessage";

export default function AuthForm() {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();
    const data = useActionData<typeof action>();

    const isSubmiting = Boolean(navigation.submission) || fetcher.state !== "idle";

    const authMode = searchParams.get("mode") || "signin";
    const submitBtnCaption = authMode === "signin" ? "Sign In" : "Sign Up";
    const toggleBtnCaption = authMode === "signin" ? "Don't have an account? Sign Up" : "Already have an account? Sign In";

    const googleSignin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            fetcher.submit(
                { accessToken: tokenResponse.access_token },
                {
                    method: "post",
                    action: "/auth?mode=google",
                }
            );
        },
    });

    return (
        <div className="w-full md:w-2/4 lg:w-1/4 mx-auto bg-white shadow-md rounded-md p-4">
            <div className="flex flex-col items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white">
                    {authMode === "signin" ? <FaLock /> : <FaUserPlus />}
                </div>
                <h2 className="text-lg font-semibold">{submitBtnCaption}</h2>
            </div>
            {data?.errors?.credentials ||
                (fetcher.type === "done" && fetcher.data?.errors?.credentials && (
                    <div className="flex justify-center mb-4">
                        <ErrorMessage message={data?.errors?.credentials || fetcher.data?.errors?.credentials} />
                    </div>
                ))}
            <Form method="post">
                {authMode === "signup" && (
                    <div className="mb-4">
                        <input
                            className="w-full border px-2 py-3 rounded-md focus:outline-primary"
                            type="text"
                            name="name"
                            placeholder="Name *"
                        />
                        <ErrorMessage message={data?.errors?.name} />
                    </div>
                )}
                <div className="mb-4">
                    <input
                        className="border w-full px-2 py-3 rounded-md focus:outline-primary"
                        type="text"
                        name="email"
                        placeholder="Email Address *"
                    />
                    <ErrorMessage message={data?.errors?.email} />
                </div>
                <div className="mb-4">
                    <input
                        className="border w-full px-2 py-3 rounded-md focus:outline-primary"
                        type="password"
                        name="password"
                        placeholder="Password *"
                    />
                    <ErrorMessage message={data?.errors?.password} />
                </div>
                {authMode === "signup" && (
                    <div className="mb-4">
                        <input
                            className="border w-full px-2 py-3 rounded-md focus:outline-primary"
                            type="password"
                            name="repeatPassword"
                            placeholder="Repeat Password *"
                        />
                        <ErrorMessage message={data?.errors?.repeatPassword} />
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <button
                        type="submit"
                        disabled={isSubmiting}
                        className="w-full bg-primary text-white py-2 rounded-md uppercase font-semibold disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {submitBtnCaption}
                    </button>
                    <button
                        type="button"
                        disabled={isSubmiting}
                        onClick={() => googleSignin()}
                        className="w-full flex items-center justify-center gap-x-1 bg-primary text-white py-2 rounded-md uppercase font-semibold disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        <FaGoogle /> {"Google " + submitBtnCaption}
                    </button>
                    <Link to={authMode === "signin" ? "?mode=signup" : "?mode=signin"} className="w-full text-center">
                        {toggleBtnCaption}
                    </Link>
                </div>
            </Form>
        </div>
    );
}
