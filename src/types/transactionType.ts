export interface TransactionType {
    name:string;
    amount:number;
    date:string;
    category: "Food" | "Transportation" | "Bills" | "Shopping" | "Education" | "Other";
    transactionId:string;
    createdAt : number;
}