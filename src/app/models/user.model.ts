export class User {
    EmployeeId: number;
    UserId: number;
    CompanyId: number;
    FirstName: string;
    LastName1: string;
    LastName2: string;
    CURP: string;
    RFC: string;
    CreatedByUserId: number;
    PasswordHash: string;
    EmailAddress: string;
    Links: {
        SelfUri: string
    }
}