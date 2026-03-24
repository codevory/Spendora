export interface TransactionType {
    name:string;
    amount:number;
    date:string;
    category: "Food" | "Travel" | "Bills" | "Shopping" | "Other";
    transactionId:string;
}