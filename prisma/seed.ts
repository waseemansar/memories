import { PrismaClient } from "@prisma/client";

import posts from "./data/posts";
import users from "./data/users";

const prisma = new PrismaClient();

async function main() {
    await prisma.post.createMany({ data: posts });
    await prisma.user.createMany({ data: users });
}

main()
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
