export interface cloudinaryFetchData {
    username: string;
    folderId: string;
    fileName: string;
    uploadType: string;
}

export interface cloudinaryUploadData {
    filePath: string;
    username: string;
    folderId: number;
    fileName: string;
    authenticated: boolean;
}

export interface cloudinaryEditData {
    username: string;
    folderId: number;
    oldName: string;
    newName: string;
    currentType: string;
    updatedType: string;
}

export interface cloudinaryRemoveData {
    username: string;
    folderId: number;
    fileName: string;
    uploadType: string;
}

export interface cloudinaryRemoveMultipleData {
    username: string;
    folderId: number;
    files: any[];
}