import { prisma } from '../../lib/prisma';


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