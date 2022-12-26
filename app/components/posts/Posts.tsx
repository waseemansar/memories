import type { Post } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes";

import PostItem from "./PostItem";

export default function PostsGrid() {
    const posts = useLoaderData<typeof loader>();

    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
            {posts.map((item: Post) => (
                <PostItem key={item.id} post={item} />
            ))}
        </div>
    );
}
