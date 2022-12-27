import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { User } from "@prisma/client";

const sessionStorage = createCookieSessionStorage({
    cookie: {
        secure: process.env.NODE_ENV === "production",
        secrets: [process.env.SESSION_SECRET as string],
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true, // toensure client side JS code cannot access this cookie
    },
});

export type SessionUser = {
    id: string;
    name: string;
    email: string;
};

export async function createUserSession(user: User, redirectPath: string) {
    const { id, name, email } = user;
    const session = await sessionStorage.getSession();
    session.set("user", { id, name, email });

    return redirect(redirectPath, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
}

export async function getUserFromSession(request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const user: SessionUser = session.get("user");

    if (!user) {
        return null;
    }
    return user;
}

export async function destroyUserSession(request: Request, redirectPath: string) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    return redirect(redirectPath, {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}

export async function requireUserSession(request: Request, redirectPath: string) {
    const user = await getUserFromSession(request);
    if (!user) {
        throw redirect(redirectPath);
    }
    return user;
}
