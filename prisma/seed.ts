import { PrismaClient } from "@prisma/client";

import users from "./data/users";

const prisma = new PrismaClient();

async function main() {
    users.map(async (user) => {
        const { name, email, password, posts } = user;
        await prisma.user.create({
            data: { name, email, password, posts: { create: [...posts] } },
        });
    });
}

main()
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
