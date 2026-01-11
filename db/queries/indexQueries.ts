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

export async function isUsernameUnique(username: string) {
    const user = await getUserByUsername(username);

    return user === null;
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
    });

    return folders;
}

// ------------ SELECT QUERIES ------------

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

// ------------ INSERT QUERIES ------------
