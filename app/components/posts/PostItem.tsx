import { useFetcher, useMatches } from "@remix-run/react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import moment from "moment";
import type { PostWithCreator } from "~/types/posts";
import { useEffect } from "react";

type PostItemProps = {
    post: PostWithCreator;
};

export default function PostItem({ post }: PostItemProps) {
    const fetcher = useFetcher();
    const matches = useMatches();
    const user = matches.find((match) => match.id === "routes/__index")?.data;

    const formatPostTags = () => {
        const formatedTags = post.tags.map((tag) => "#" + tag);
        return formatedTags.join(" ");
    };

    useEffect(() => {
        if (fetcher.type === "done" && fetcher.data?.errors?.error) {
            alert(fetcher.data?.errors?.error);
        }
    }, [fetcher]);

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

    const Likes = () => {
        const likesCount = post.likes.length;

        if (user) {
            return (
                <>
                    {post.likes.includes(user.id) ? <AiFillLike /> : <AiOutlineLike />}{" "}
                    {likesCount === 0 ? "Like" : likesCount === 1 ? `${likesCount} Like` : `${likesCount} Likes`}
                </>
            );
        } else {
            return (
                <>
                    <AiOutlineLike /> Like
                </>
            );
        }
    };

    return (
        <div className="bg-white relative overflow-hidden rounded-md">
            <img className="w-full h-56 object-cover bg-blend-overlay" src={post.selectedFile} alt={post.title} />
            <div className="w-full absolute top-4 z-10 flex items-center justify-between px-4">
                <div>
                    <p className="text-white text-lg font-semibold">{post.creator.name}</p>
                    <p className="text-white text-sm">{moment(post.createdAt).fromNow()}</p>
                </div>
            </div>
            <div className="p-4">
                <p className="text-gray-500 text-sm">{formatPostTags()}</p>
                <h2 className="h-14 flex items-center text-black text-2xl font-semibold my-4">{post.title}</h2>
                <p className="line-clamp-2 text-gray-500 text-md">{post.message}</p>
                <div className="flex items-center justify-between mt-4">
                    <button
                        disabled={!user}
                        onClick={likePostHandler}
                        className="flex items-center gap-x-1 text-primary uppercase disabled:text-gray-500"
                    >
                        <Likes />
                    </button>
                    {user?.id === post.creatorId && (
                        <button onClick={deletePostHandler} className="flex items-center gap-x-1 text-primary uppercase">
                            <FaTrash /> Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
