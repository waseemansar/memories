import type { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import Navigation from "~/components/ui/Navigation";
import { getUserFromSession } from "~/utils/session.server";

export default function IndexLayout() {
    return (
        <>
            <Navigation />
            <Outlet />
        </>
    );
}

export const loader: LoaderFunction = ({ request }) => {
    return getUserFromSession(request);
};
