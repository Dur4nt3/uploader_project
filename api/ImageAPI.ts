import PrepareImageAPIData from './PrepareImageAPIData';

export default abstract class ImageAPI {
    constructor(protected readonly dataConverter: PrepareImageAPIData) {}

    abstract fetch(fetchData: any): Promise<any>;

    abstract upload(uploadData: any): Promise<any>;

    abstract edit(editData: any): Promise<any>;

    abstract remove(removeData: any): Promise<any>;

    abstract removeMultiple(removeMultipleData: any): Promise<any>;
}
