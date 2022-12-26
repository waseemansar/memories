import type { Post } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import moment from "moment";

type PostItemProps = {
    post: Post;
};

export default function PostItem({ post }: PostItemProps) {
    const fetcher = useFetcher();

    const formatPostTags = () => {
        const formatedTags = post.tags.map((tag) => "#" + tag);
        return formatedTags.join(" ");
    };

    const likePostHandler = () => {
        fetcher.submit(
            { postId: post.id },
            {
                method: "patch",
            }
        );
    };

    const deletePostHandler = () => {
        fetcher.submit(
            { postId: post.id },
            {
                method: "delete",
            }
        );
    };

    return (
        <div className="bg-white relative overflow-hidden rounded-md">
            <img className="w-full h-56 object-cover bg-blend-overlay" src={post.selectedFile} alt={post.title} />
            <div className="w-full absolute top-4 z-10 flex items-center justify-between px-4">
                <div>
                    <p className="text-white text-lg font-semibold">{post.creator}</p>
                    <p className="text-white text-sm">{moment(post.createdAt).fromNow()}</p>
                </div>
                {/* <button className="text-white text-lg font-bold">...</button> */}
            </div>
            <div className="p-4">
                <p className="text-gray-500 text-sm">{formatPostTags()}</p>
                <h2 className="h-14 flex items-center text-black text-2xl font-semibold my-4">{post.title}</h2>
                <p className="line-clamp-2 text-gray-500 text-md">{post.message}</p>
                <div className="flex items-center justify-between mt-4">
                    <button onClick={likePostHandler} className="text-primary uppercase">
                        <i className="fa fa-thumbs-up"></i> Like{post.likeCount}
                    </button>
                    <button onClick={deletePostHandler} className="text-primary uppercase">
                        <i className="fa-sharp fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
