import type { PostWithCreator } from "~/types/posts";
import { prisma } from "./database.server";
import { removeImage } from "./file.server";
import { cleanTags } from "./helpers.server";

export async function createPost(creatorId: string, title: string, message: string, tags: string, selectedFile: string) {
    try {
        await prisma.post.create({
            data: {
                title,
                message,
                tags: cleanTags(tags),
                selectedFile,
                creator: { connect: { id: creatorId } },
            },
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getPosts() {
    try {
        const posts: PostWithCreator[] = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: { creator: { select: { name: true } } },
        });
        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function likePost(postId: string, userId: string) {
    try {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (post) {
            const index = post.likes.findIndex((id) => id === userId);
            if (index === -1) {
                post.likes.push(userId);
            } else {
                post.likes = post.likes.filter((id) => id !== userId);
            }
            await prisma.post.update({ where: { id: postId }, data: { likes: post.likes } });
        }
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
