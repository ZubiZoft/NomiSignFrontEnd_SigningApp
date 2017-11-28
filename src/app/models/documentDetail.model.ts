export class DocumentDetail {
    DocumentId: number;
    EmployeeId: number;
    UploadTime: string;
    PayperiodDate: string;
    SignStatus: number;
    SignStatusText: string;
    DocumentBytes: string;
    BatchId: number;
    Links: {
        SelfUri: string;
    }
}