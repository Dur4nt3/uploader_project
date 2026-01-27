export default class ImageId {
    static createId(username: string, folderId: string, fileName: string) {
        return `${username}-${folderId}-${fileName}`;
    }
}
