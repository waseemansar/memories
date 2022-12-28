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
import { z } from "zod";

import PostForm from "~/components/posts/PostForm";
import PostsGrid from "~/components/posts/Posts";
import { createPost, deletePost, getPosts, likePost } from "~/utils/posts.server";
import { validateAction } from "~/utils/validation.server";
import { getUserFromSession } from "~/utils/session.server";
import { useLoaderData } from "@remix-run/react";

const UPLOAD_DIRECTORY = "uploads";
const MAX_FILE_SIZE = 300000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    message: z.string().min(1, { message: "Message is required" }),
    tags: z.string().regex(/([^,]+)/, { message: "Tags should be comma seprated" }),
    selectedFile: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 3MB`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), "Only .jpg, .jpeg, .png and .webp formats are supported"),
});

type ActionInput = z.TypeOf<typeof schema>;

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
        const { errors } = await validateAction<ActionInput>({ request: cloneRequest, schema });
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

        invariant(typeof creatorId === "string", "Creator is required");
        invariant(typeof title === "string", "Title must be a string");
        invariant(typeof message === "string", "Message must be a string");
        invariant(typeof tags === "string", "Tags must be a string");

        const uploadedFile = `/${UPLOAD_DIRECTORY}/${selectedFile.name}`;
        await createPost(creatorId, title, message, tags, uploadedFile);
    }

    return redirect("/");
};
