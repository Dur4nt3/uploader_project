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

        await Promise.allSettled(result.map((file) => {
            const removeData: cloudinaryRemoveData = {
                username: file.folder.owner.username,
                folderId: file.folderId,
                fileName: file.name,
                uploadType: file.visibility.name === 'private' ? 'authenticated' : 'upload'
            }

            console.log(`${removeData.username}-${removeData.folderId}-${removeData.fileName} pending removal`);
            return imageAPIProvider.remove(removeData);
        }))

        console.log('All old files removed from Cloudinary');

        const deleted = await prisma.file.deleteMany({
            where: {
                creationDate: {
                    lt: timeRestriction,
                },
            },
        });

        console.log(`Deleted ${deleted.count} files from the database!`)
    } catch (error) {
        console.error(error);
    }
}

main()
    .catch(async (e) => {
        console.error(e);
        process.exitCode = 1;
    }).finally(async () => {
        await prisma.$disconnect();
        process.exit();
    });
