import type { PostWithCreator } from "~/types/posts";
import { prisma } from "./database.server";
import { CustomError } from "./errors";
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
        removeImage(selectedFile);
        throw new CustomError("Failed to add post.", 500);
    }
}

export async function getPosts(page: number | null) {
    try {
        page = page || 1;
        const LIMIT = 9;
        const startIndex = (page - 1) * LIMIT;
        const total = await prisma.post.count();

        const posts: PostWithCreator[] = await prisma.post.findMany({
            skip: startIndex,
            take: LIMIT,
            orderBy: { id: "desc" },
            include: { creator: { select: { name: true } } },
        });

        return { posts, currentPage: page, numberofPages: Math.ceil(total / LIMIT) };
    } catch (error) {
        console.log(error);
        throw new CustomError("Failed to get posts.", 500);
    }
}

export async function searchPosts(title: string, tags: string) {
    try {
        let posts: PostWithCreator[] = await prisma.post.findMany({
            where: {
                OR: [{ title: { contains: title.trim() as string, mode: "insensitive" } }, { tags: { hasSome: tags.split(",") } }],
            },
            orderBy: { id: "desc" },
            include: { creator: { select: { name: true } } },
        });

        return posts;
    } catch (error) {
        console.log(error);
        throw new CustomError("Failed to get posts.", 500);
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
        throw new CustomError("Failed to like post.", 500);
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
        throw new CustomError("Failed to delete post.", 500);
    }
}
