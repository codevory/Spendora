export interface TransactionType {
    name:string;
    amount:number;
    date:string;
    category: string;
    transactionId:string;
    createdAt : number;
}

export interface IncomeType {
    amount:number;
    source:string;
    date:string;
    transactionId:string;
    createdAt:number;
}