import console from 'node:console';
import { prisma } from './lib/prisma';

async function main() {
    try {
        const visibilities = await prisma.visibility.createMany({
            data: [
                {
                    name: 'private',
                    description:
                        'Only you can view this folder',
                },
                {
                    name: 'public',
                    description:
                        'Anyone can view this folder',
                },
            ],
        });
    } catch (error) {
        console.error(
            '------------------Initialization Error------------------',
        );
        console.error(error);
        console.error(
            '------------------Initialization Error------------------',
        );
    }
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
