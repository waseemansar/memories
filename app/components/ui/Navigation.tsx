import { Form, Link, useLoaderData } from "@remix-run/react";
import type { loader } from "~/root";

const Navigation = () => {
    const user = useLoaderData<typeof loader>();

    return (
        <nav className="bg-white flex justify-between items-center px-8 py-2 mb-8 rounded-lg shadow-md shadow-black/25">
            <Link to=".." className="flex items-center justify-center gap-x-2">
                <h2 className="text-primary text-2xl md:text-3xl">Memories</h2>
                <img className="w-6 h-6 md:w-8 md:h-8" src="/images/memories.png" alt="Memories Logo" />
            </Link>
            {user ? (
                <Form method="post" action="/logout">
                    <button
                        type="submit"
                        className="w-20 md:w-28 py-1 md:py-2 text-sm md:text-base bg-rose-500 text-white text-center uppercase rounded-md"
                    >
                        Log Out
                    </button>
                </Form>
            ) : (
                <Link
                    to="/auth"
                    className="w-20 md:w-28 py-1 md:py-2 text-sm md:text-base bg-primary text-white text-center uppercase rounded-md"
                >
                    Sign In
                </Link>
            )}
        </nav>
    );
};

export default Navigation;
