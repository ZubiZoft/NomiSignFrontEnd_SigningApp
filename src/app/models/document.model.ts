export class Document {
    DocumentId: number;
    EmployeeId: number;
    PayperiodDate: string;
    SignStatus: string;
    PayAmount: number;
    PayAmountMoney: string;
    AlwaysShow: number;
    ViewFlag: boolean;
    Links: {
        SelfUri: string
    }
}
