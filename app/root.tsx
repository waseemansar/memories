import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from "@remix-run/react";

import tailwindStyles from "~/styles/tailwind.css";
import Error from "~/components/ui/Error";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Memories",
    viewport: "width=device-width,initial-scale=1",
});

type DocumentProps = {
    title?: string;
    children: React.ReactNode;
};

function Document({ title, children }: DocumentProps) {
    return (
        <html lang="en">
            <head>
                {title && <title>{title}</title>}
                <Meta />
                <Links />
            </head>
            <body className="p-8">
                {children}
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <Document>
            <Outlet />
        </Document>
    );
}

export function CatchBoundary() {
    const caughtResponse = useCatch();

    return (
        <Document title={caughtResponse.statusText}>
            <main>
                <Error title={caughtResponse.statusText}>
                    <p className="text-gray-700 text-sm">
                        {caughtResponse.data?.message || "Something went wrong. Please try again later."}
                    </p>
                    <p className="text-gray-700 text-sm">
                        Back to{" "}
                        <Link to="/" className="text-primary">
                            safety
                        </Link>
                        !
                    </p>
                </Error>
            </main>
        </Document>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {
    return (
        <Document title="An error occurred">
            <main>
                <Error title="An error occurred">
                    <p className="text-gray-700 text-sm">{error.message || "Something went wrong. Please try again later."}</p>
                    <p className="text-gray-700 text-sm">
                        Back to <Link to="/">safety</Link>!
                    </p>
                </Error>
            </main>
        </Document>
    );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindStyles }];
