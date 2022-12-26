import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import tailwindStyles from "~/styles/tailwind.css";
import Navigation from "~/components/ui/Navigation";

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

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindStyles }];
