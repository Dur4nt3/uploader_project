import { prisma } from '../../lib/prisma';

export async function updateFolder(folderId: number, name: string, visibilityId: number, userId: number, description?: string) {
    let folder;

    try {
        folder = await prisma.folder.update({
            where: {
                folderId,
                userId,
            },
            data: {
                name,
                visibilityId,
                userId,
                description: description !== undefined ? description : null,
            }
        })
    } catch (error) {
        console.error(error);
        return null;
    }

    return folder;
}