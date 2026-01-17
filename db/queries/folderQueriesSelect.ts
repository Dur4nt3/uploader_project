import { prisma } from '../../lib/prisma';

// ------------ SELECT QUERIES ------------

export async function getFilesByFolderId(folderId: number) {
    let files;

    try {
        files = await prisma.file.findMany({
            where: {
                folderId,
            },
            include: {
                visibility: true,
            },
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    return files;
}

// ------------ SELECT QUERIES ------------

// ------------ SELECT QUERIES (VALIDATION ONLY) ------------

// The uniqueness here is only within the same folder of the same user
// It is on purpose that having two files with the same name in two different folders
// passes this check
export async function isUserFileUnique(folderId: number, name: string) {
    let files;

    try {
        files = await prisma.file.findMany({
            where: {
                folderId,
                name,
            },
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    return files;
}

// To stay consistent with the process of creating a folder
// we are checking if the user actually exists before creating a file
// this is done implicitly in folder creation via the isUserAllowToCreateFolder function
export async function isUserAllowedToCreateFile(userId: number) {
    let files;

    try {
        files = await prisma.file.findMany({
            where: {
                folder: {
                    userId,
                },
            },
            take: 10,
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    return files.length < 10;
}

// ------------ SELECT QUERIES (VALIDATION ONLY) ------------
