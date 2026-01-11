import { prisma } from './lib/prisma';

async function main(userId: number, username: string) {
    const user1 = await prisma.user.findUnique({
        where: {
            userId: userId,
        },
    });

    const user2 = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    console.log(user1, user2);
}

main(1, 'johnDoe')
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
