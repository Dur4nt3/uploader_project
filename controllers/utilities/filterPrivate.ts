export default function filterPrivate(files: any[]) {
    if (files.length === 0) {
        return [];
    }

    if (files[0].visibility === undefined) {
        return null;
    }

    const publicFiles = files.filter((file) => {
        return file.visibility.name === 'public';
    });

    return publicFiles;
}