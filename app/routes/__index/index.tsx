import {
    json,
    redirect,
    unstable_composeUploadHandlers,
    unstable_createFileUploadHandler,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";

import PostForm from "~/components/posts/PostForm";
import PostsGrid from "~/components/posts/Posts";
import { createPost, deletePost, getPosts, likePost } from "~/utils/posts.server";
import { validateAction } from "~/utils/validation.server";
import { getUserFromSession } from "~/utils/session.server";
import { useLoaderData } from "@remix-run/react";
import { postSchema } from "~/utils/schema.server";
import type { PostActionInput } from "~/utils/schema.server";

const UPLOAD_DIRECTORY = "uploads";

export default function Index() {
    const data = useLoaderData<typeof loader>();

    return (
        <main className="grid grid-cols-7 gap-3 px-4">
            <div className="col-span-7 order-2 sm:col-span-5 sm:order-1 2xl:col-span-5">
                <PostsGrid />
            </div>
            <div className="col-span-7 order-1 sm:col-span-2 sm:order-2 2xl:col-span-2">
                {data.user ? (
                    <PostForm />
                ) : (
                    <div className="bg-white shadow-md rounded-md p-4">
                        <p>Please sign in to create your own memories and like other's memories.</p>
                    </div>
                )}
            </div>
        </main>
    );
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUserFromSession(request);
    const posts = await getPosts();
    return { posts, user };
};

export const action: ActionFunction = async ({ request }) => {
    const user = await getUserFromSession(request);

    if (request.method === "PATCH") {
        const formData = await request.formData();
        const postId = formData.get("postId");
        const userId = user?.id;

        invariant(typeof userId === "string", "User id is required");
        invariant(typeof postId === "string", "Post id must be a string");

        await likePost(postId, userId);
    } else if (request.method === "DELETE") {
        const formData = await request.formData();
        const postId = formData.get("postId");

        invariant(typeof postId === "string", "Post id must be a string");

        await deletePost(postId);
    } else if (request.method === "POST") {
        const cloneRequest = request.clone();
        const { errors } = await validateAction<PostActionInput>({ request: cloneRequest, schema: postSchema });
        if (errors) {
            return json({ errors }, { status: 422 });
        }

        const uploadHandler = unstable_composeUploadHandlers(
            unstable_createFileUploadHandler({
                directory: `public/${UPLOAD_DIRECTORY}`,
                file: ({ filename }) => filename,
            }),
            unstable_createMemoryUploadHandler()
        );

        const formData = await unstable_parseMultipartFormData(request, uploadHandler);
        const title = formData.get("title");
        const message = formData.get("message");
        const tags = formData.get("tags");
        const selectedFile = formData.get("selectedFile") as File;
        const creatorId = user?.id;

        invariant(typeof creatorId === "string", "Creator id is required");
        invariant(typeof title === "string", "Title must be a string");
        invariant(typeof message === "string", "Message must be a string");
        invariant(typeof tags === "string", "Tags must be a string");

        const uploadedFile = `/${UPLOAD_DIRECTORY}/${selectedFile.name}`;
        await createPost(creatorId, title, message, tags, uploadedFile);
    }

    return redirect("/");
};
