export interface apiFetchData {
    username: string;
    folderId: string;
    fileName: string;
    fileVisibility: string;
}

export interface apiUploadData {
    filePath: string;
    username: string;
    folderId: number;
    fileName: string;
    fileVisibility: string;
}

export interface apiEditData {
    username: string;
    folderId: number;
    oldName: string;
    newName: string;
    currentFileVisibility: string;
    updatedFileVisibility: string;
}

export interface apiRemoveData {
    username: string;
    folderId: number;
    fileName: string;
    fileVisibility: string;
}

export interface apiRemoveMultipleData {
    username: string;
    folderId: number;
    files: any[];
}