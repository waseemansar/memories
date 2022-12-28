import type { Post } from "@prisma/client";

type Creator = {
    name: string;
};
export type PostWithCreator = Post & {
    creator: Creator;
};
