import { PrismaClient } from "@prisma/client";

import posts from "./data/posts";

const prisma = new PrismaClient();

async function main() {
    await prisma.post.createMany({ data: posts });
}

main()
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
