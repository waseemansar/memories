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

const UPLOAD_DIRECTORY = "uploads";
const MAX_FILE_SIZE = 300000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function Index() {
    return (
        <main className="grid grid-cols-5 gap-3">
            <div className="col-span-5 sm:col-span-3 2xl:col-span-4">
                <PostsGrid />
            </div>
            <div className="col-span-5 sm:col-span-2 2xl:col-span-1">
                <PostForm />
            </div>
        </main>
    );
}

export const loader: LoaderFunction = () => {
    return getPosts();
};

const schema = z.object({
    creator: z.string().min(1, { message: "Creator is required" }),
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
    if (request.method === "PATCH") {
        const formData = await request.formData();
        const postId = formData.get("postId");

        invariant(typeof postId === "string", "Post id must be a string");

        await likePost(postId);
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
        const creator = formData.get("creator");
        const title = formData.get("title");
        const message = formData.get("message");
        const tags = formData.get("tags");
        const selectedFile = formData.get("selectedFile") as File;

        invariant(typeof creator === "string", "Creator must be a string");
        invariant(typeof title === "string", "Title must be a string");
        invariant(typeof message === "string", "Message must be a string");
        invariant(typeof tags === "string", "Tags must be a string");

        const uploadedFile = `/${UPLOAD_DIRECTORY}/${selectedFile.name}`;
        await createPost(creator, title, message, tags, uploadedFile);
    }

    return redirect("/");
};
