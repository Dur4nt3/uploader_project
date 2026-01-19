import { prisma } from '../../lib/prisma';

export async function updateFile(fileId: number, name: string, visibilityId: number, folderId: number, description?: string) {
    let file;

    try {
        file = await prisma.file.update({
            where: {
                folderId,
                fileId,
            },
            data: {
                name,
                visibilityId,
                description: description !== undefined ? description : null,
            }
        })
    } catch (error) {
        console.error(error);
        return null;
    }

    return file;
}