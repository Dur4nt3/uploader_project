import { prisma } from '../../lib/prisma';

// ------------ SELECT QUERIES ------------

export async function getUserById(userId: number) {
    const user = await prisma.user.findUnique({
        where: {
            userId: userId,
        },
    });

    return user;
}

export async function getUserByUsername(username: string) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    return user;
}

export async function getUserAndFolders(userId: number) {
    const user = await prisma.user.findUnique({
        where: {
            userId: userId,
        },

        include: {
            folders: true,
        },
    });

    return user;
}

export async function getFoldersByUserId(userId: number) {
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId,
        },
        include: {
            files: {
                include: {
                    visibility: true,
                },
            },
            visibility: true,
        },
    });

    return folders;
}

// NOTE:
// This is also a great validation query
// It checks whether:
// 1) A specified folder exists
// 2) The specified folder belongs to the user
export async function getFolderByUserIdAndFolderId(
    userId: number,
    folderId: number,
) {
    let folder;

    try {
        folder = await prisma.folder.findUnique({
            where: {
                folderId,
                userId,
            },
            include: {
                visibility: true
            }
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    return folder;
}

export async function getFolderByUserIdAndName(userId: number, name: string) {
    const folder = await prisma.folder.findFirst({
        where: {
            userId,
            name,
        },
    });

    return folder;
}

export async function getFolderByFolderId(folderId: number) {
    let folder;

    try {
        folder = await prisma.folder.findUnique({
            where: {
                folderId,
            },

            include: {
                visibility: true,
                files: {
                    include: {
                        visibility: true
                    }
                },
            },
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    return folder;
}

export async function getAllVisibilityOptions() {
    const options = await prisma.visibility.findMany();

    return options;
}

// ------------ SELECT QUERIES ------------

// ------------ SELECT QUERIES (VALIDATION ONLY) ------------

export async function isUsernameUnique(username: string) {
    const user = await getUserByUsername(username);

    return user === null;
}

export async function isUserFolderUnique(userId: number, name: string) {
    const folder = await prisma.folder.findMany({
        where: {
            userId: userId,
            name: {
                equals: name,
                mode: 'insensitive',
            },
        },
    });

    return folder.length === 0;
}

export async function isValidVisibilityId(visibilityId: number) {
    const visibility = await prisma.visibility.findUnique({
        where: {
            visibilityId: visibilityId,
        },
    });

    return visibility !== null;
}

export async function isUserAllowToCreateFolder(userId: number) {
    const userFolders = await getUserAndFolders(userId);

    if (userFolders === null) {
        return false;
    }

    return userFolders.folders.length < 10;
}

export async function isVisibilityMatching(visibilityId: number, name: string) {
    const visibility = await prisma.visibility.findUnique({
        where: {
            visibilityId,
        },
    });

    if (visibility === null) {
        return null;
    }

    return visibility.name === name;
}

export async function isVisibilityPrivate(visibilityId: number) {
    const visibility = await prisma.visibility.findUnique({
        where: {
            visibilityId,
        },
    });

    if (visibility === null) {
        return null;
    }

    return visibility.name === 'private';
}

export async function isVisibilityPublic(visibilityId: number) {
    const visibility = await prisma.visibility.findUnique({
        where: {
            visibilityId,
        },
    });

    if (visibility === null) {
        return null;
    }

    return visibility.name === 'public';
}

// ------------ SELECT QUERIES (VALIDATION ONLY) ------------
