import { prisma } from './lib/prisma';

import type { cloudinaryRemoveData } from './types/cloudinaryRequiredData';

import CloudinaryAPI from './api/CloudinaryAPI';

const imageAPIProvider = new CloudinaryAPI();

async function main() {
    const timeRestriction = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    try {
        const result = await prisma.file.findMany({
            where: {
                creationDate: {
                    lt: timeRestriction,
                },
            },
            include: {
                folder: {
                    include: {
                        owner: true
                    }
                },
                visibility: true,
            },
        });

        for (const file of result) {
            const removeData: cloudinaryRemoveData = {
                username: file.folder.owner.username,
                folderId: file.folderId,
                fileName: file.name,
                uploadType: file.visibility.name === 'private' ? 'authenticated' : 'upload'
            }

            await imageAPIProvider.remove(removeData);
        }

        const deleted = await prisma.file.deleteMany({
            where: {
                creationDate: {
                    lt: timeRestriction,
                },
            },
        });
    } catch (error) {
        console.error(error);
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
