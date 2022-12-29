import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/__index/index";
import type { PostWithCreator } from "~/types/posts";

import PostItem from "./PostItem";

export default function PostsGrid() {
    const data = useLoaderData<typeof loader>();
    const { posts, errors } = data;

    return (
        <>
            {posts &&
                (posts.length > 0 ? (
                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                        {posts.map((item: PostWithCreator) => (
                            <PostItem key={item.id} post={item} />
                        ))}
                    </div>
                ) : (
                    <p className="text-xl">No post found!</p>
                ))}
            {errors && errors.error && <p className="text-xl">{errors.error}</p>}
        </>
    );
}
