import { compare, genSaltSync, hash } from "bcryptjs";

import { prisma } from "./database.server";
import { CustomError } from "./errors";
import { createUserSession } from "./session.server";

export async function signin(email: string, password: string, redirectTo: string) {
    const existingUser = await prisma.user.findFirst({ where: { email, type: "LOCAL" } });
    if (!existingUser) {
        throw new CustomError("Invalid email or password", 401);
    }

    const passwordCorrect = await compare(password, existingUser.password as string);
    if (!passwordCorrect) {
        throw new CustomError("Invalid email or password", 401);
    }

    return createUserSession(existingUser, redirectTo);
}

export async function signup(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findFirst({ where: { email, type: "LOCAL" } });
    if (existingUser) {
        throw new CustomError("User with given email already exists", 400);
    }

    const salt = genSaltSync(Number(process.env.SALT_ROUNDS));
    const passwordHash = await hash(password, salt);

    try {
        await prisma.user.create({ data: { name, email, password: passwordHash } });
    } catch (error) {
        throw new CustomError("Failed to signup", 401);
    }
}

export async function googleSignup(name: string, email: string, picture: string, redirectTo: string) {
    try {
        const user = await prisma.user.upsert({
            where: { userEmailType: { email, type: "GOOGLE" } },
            update: { name, picture },
            create: { name, email, picture, type: "GOOGLE" },
        });
        return createUserSession(user, redirectTo);
    } catch (error) {
        throw new CustomError("Failed to signup with google", 401);
    }
}
