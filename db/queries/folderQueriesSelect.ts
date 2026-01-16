import { prisma } from '../../lib/prisma';

// ------------ SELECT QUERIES ------------

export async function getFilesByFolderId(folderId: number) {
    let files;

    try {
        files = await prisma.file.findMany({
            where: {
                folderId
            },
            include: {
                visibility: true
            }
        })
    } catch (error) {
        console.error(error);
        return null;
    }

    return files;
}

// ------------ SELECT QUERIES ------------

// ------------ SELECT QUERIES (VALIDATION ONLY) ------------

// ------------ SELECT QUERIES (VALIDATION ONLY) ------------