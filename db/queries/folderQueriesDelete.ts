import { prisma } from '../../lib/prisma';

export async function deleteFile(fileId: number, folderId: number) {
    let file;

    try {
        file = await prisma.file.delete({
            where: {
                folderId,
                fileId,
            },
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    return file;
}
