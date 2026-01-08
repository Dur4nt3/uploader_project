import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const passwordHash = await bcrypt.hash('1234', 10);
    const user = await prisma.user.create({
        data: {
            username: 'johnDoe',
            name: 'John Doe',
            password: passwordHash,
        },
    });

    const allUsers = await prisma.user.findMany();

    console.log(allUsers);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
