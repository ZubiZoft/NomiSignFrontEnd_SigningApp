export class Document {
    DocumentId: number;
    EmployeeId: number;
    PayperiodDate: string;
    SignStatus: string;
    PayAmount: number;
    NetPayAmount: number;
    PayAmountMoney: string;
    AlwaysShow: number;
    ViewFlag: boolean;
    NomCert: string;
    Links: {
        SelfUri: string
    }
}
