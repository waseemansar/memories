import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/__index/index";
import type { PostWithCreator } from "~/types/posts";
import type { SessionUser } from "~/types/users";

import PostItem from "./PostItem";

export default function PostsGrid() {
    const data = useLoaderData<typeof loader>();
    const { user }: { user: SessionUser } = data;

    return data.posts.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
            {data.posts.map((item: PostWithCreator) => (
                <PostItem key={item.id} user={user} post={item} />
            ))}
        </div>
    ) : (
        <p className="text-xl text-white">No post found!</p>
    );
}
