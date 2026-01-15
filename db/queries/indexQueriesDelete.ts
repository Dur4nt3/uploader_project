import { prisma } from '../../lib/prisma';

export async function deleteFolder(userId: number, folderId: number) {
    let folder;
    let files;

    try {
        files = await prisma.file.deleteMany({
            where: {
                folderId,
            },
        });

        folder = await prisma.folder.delete({
            where: {
                folderId,
                userId,
            },
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    return folder && files;
}
