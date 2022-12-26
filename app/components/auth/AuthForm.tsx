import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { FaLock, FaUserPlus } from "react-icons/fa";
import type { action } from "~/routes/auth";

import ErrorMessage from "../ui/ErrorMessage";

export default function AuthForm() {
    const [searchParams] = useSearchParams();
    const data = useActionData<typeof action>();

    const authMode = searchParams.get("mode") || "signin";
    const submitBtnCaption = authMode === "signin" ? "Sign In" : "Sign Up";
    const toggleBtnCaption = authMode === "signin" ? "Don't have an account? Sign Up" : "Already have an account? Sign In";

    return (
        <div className="w-1/4 mx-auto bg-white shadow-md rounded-md p-4">
            <div className="flex flex-col items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white">
                    {authMode === "signin" ? <FaLock /> : <FaUserPlus />}
                </div>
                <h2 className="text-lg font-semibold">{submitBtnCaption}</h2>
            </div>
            <Form method="post">
                {authMode === "signup" && (
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="w-full">
                            <input
                                className="w-full border px-2 py-3 rounded-md focus:outline-primary"
                                type="text"
                                name="firstName"
                                placeholder="First Name *"
                            />
                            <ErrorMessage message={data?.errors?.firstName} />
                        </div>
                        <div className="w-full">
                            <input
                                className="w-full border px-2 py-3 rounded-md focus:outline-primary"
                                type="text"
                                name="lastName"
                                placeholder="Last Name *"
                            />
                            <ErrorMessage message={data?.errors?.lastName} />
                        </div>
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
                            type="text"
                            name="repeatPassword"
                            placeholder="Repeat Password *"
                        />
                        <ErrorMessage message={data?.errors?.repeatPassword} />
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md uppercase font-semibold disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {submitBtnCaption}
                    </button>
                    <Link to={authMode === "signin" ? "?mode=signup" : "?mode=signin"} className="w-full text-center">
                        {toggleBtnCaption}
                    </Link>
                </div>
            </Form>
        </div>
    );
}
