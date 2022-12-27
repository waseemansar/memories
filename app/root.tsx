import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import tailwindStyles from "~/styles/tailwind.css";
import Navigation from "~/components/ui/Navigation";
import { getUserFromSession } from "./utils/session.server";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Memories",
    viewport: "width=device-width,initial-scale=1",
});

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="p-8">
                <header>
                    <Navigation />
                </header>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export const loader: LoaderFunction = async ({ request }) => {
    return getUserFromSession(request);
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindStyles }];
