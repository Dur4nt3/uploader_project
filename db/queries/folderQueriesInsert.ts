import { prisma } from "../../lib/prisma";

export async function createFile(name: string, folderId: number, visibilityId: number, description?: string) {
    const file = prisma.file.create({
        data: {
            name,
            folderId,
            visibilityId,
            description: description !== undefined ? description : null,
        }
    });

    return file;
}