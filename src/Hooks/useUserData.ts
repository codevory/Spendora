import type { ChartData } from "chart.js"
import { useAppSelector } from "../store/store"


export const useUserData = () => {
const trans = useAppSelector((state) => state.transaction.transactions);

const groupedAmounts = trans.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.category] = (acc[curr.category] ?? 0) + Number(curr.amount);
    return acc;
}, {});

const labels = Object.keys(groupedAmounts);
const amounts = Object.values(groupedAmounts);
const prevMonth = getMonthlyData();
const prevAmounts = Object.values(prevMonth)

const pieData:ChartData<"pie"> = {
    labels,
    datasets:[
        {
            label:"Expense distribution",
            data:amounts,
            backgroundColor: ["blue", "green", "orange", "purple", "yellow","red"],
            borderWidth: 1,
            borderColor: "black",
            borderAlign: "inner",
            hoverOffset: 14,
        }
    ]
}
    
const barData:ChartData<"bar"> = {
    labels,
    datasets:[
        {
            label:"Expense",
            data:amounts,
            backgroundColor: ["blue", "green", "orange", "purple", "yellow","red"],
            borderColor: "pink",
            borderWidth: 2,
            hoverBorderWidth: 3,
        }
    ]
}

const lineData:ChartData<"line"> = {
    labels,
    datasets:[
        {
            label:"This Month Analysis",
            data:amounts,
            borderColor: "rgb(75,192,192)",
            borderWidth:2,
            backgroundColor:"red"
        },
        {
            label:"Prev Month Analysis",
            data:prevAmounts,
            borderColor: "red",
            borderWidth:3,
            backgroundColor:"blue"
        },
    ]
}

return {pieData,barData,lineData}
}

function getMonthlyData(){
    const date = new Date();
    const prevMonth = date.getMonth() - 1;
    const currYear = date.getFullYear();

const trans = useAppSelector((state) => state.transaction.transactions);
 return trans.filter((t) => {
    const date = new Date(t.date);
    return (
        date.getMonth() -1 === prevMonth && currYear === date.getFullYear()
    )
 }).reduce<Record<string,number>>((acc,curr) => {
    acc[curr.category] = (acc[curr.category] ?? 0) + Number(curr.amount);
    return acc;
 },{})
}