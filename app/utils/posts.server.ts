import { prisma } from "./database.server";
import { removeImage } from "./file.server";
import { cleanTags } from "./helpers.server";

export async function createPost(creator: string, title: string, message: string, tags: string, selectedFile: string) {
    try {
        await prisma.post.create({
            data: {
                creator,
                title,
                message,
                tags: cleanTags(tags),
                selectedFile,
            },
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function likePost(postId: string) {
    try {
        await prisma.post.update({
            where: { id: postId },
            data: {
                likeCount: {
                    increment: 1,
                },
            },
        });
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId: string) {
    try {
        const deletedPost = await prisma.post.delete({
            where: { id: postId },
        });

        if (deletedPost) {
            removeImage(deletedPost.selectedFile);
        }
    } catch (error) {
        console.log(error);
    }
}
