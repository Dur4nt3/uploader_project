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

    return;
}

export async function getFoldersByUserId(userId: number) {
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId,
        },
        include: {
            files: true,
            visibility: true,
        },
    });

    return folders;
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
            name: name,
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

// ------------ SELECT QUERIES (VALIDATION ONLY) ------------

// ------------ INSERT QUERIES ------------

export async function createUser(
    username: string,
    name: string,
    hashedPassword: string,
) {
    const user = await prisma.user.create({
        data: {
            username: username,
            name: name,
            password: hashedPassword,
        },
    });

    return user;
}

export async function createFolder(
    name: string,
    userId: number,
    visibilityId: number,
    description?: string,
) {
    const folder = await prisma.folder.create({
        data: {
            name,
            userId,
            visibilityId,
            description: description !== undefined ? description : null,
        },
    });

    return folder;
}

// ------------ INSERT QUERIES ------------
