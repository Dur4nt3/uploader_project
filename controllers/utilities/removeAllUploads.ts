import path from 'node:path';
import fs from 'node:fs/promises';

export default async function removeAllUploads() {
    const uploadDirectory = 'uploads';

    for (const file of await fs.readdir(uploadDirectory)) {
        if (file === 'placeholder') {
            continue;
        }
        await fs.unlink(path.join(uploadDirectory, file));
    }
}
