export default abstract class PrepareImageAPIData {
    abstract prepareFetchData(fetchData: any): any;

    abstract prepareUploadData(uploadData: any): any;

    abstract prepareEditData(editData: any): any;

    abstract prepareRemoveData(removeData: any): any;

    abstract prepareRemoveMultipleData(removeMultipleData: any): any;
}
