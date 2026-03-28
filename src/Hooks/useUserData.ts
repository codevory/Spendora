import type { ChartData } from "chart.js"
import { useAppSelector } from "../store/store"




export const useUserData = () => {
const trans = useAppSelector((state) => state.transaction.transactions);

const labels = trans.map((t) => t.category);
const amounts = trans.map((t) => t.amount);

const pieData:ChartData<"pie"> = {
    labels,
    datasets:[
        {
            label:"Expenses by Category",
            data:amounts,
            backgroundColor: ["blue", "green", "orange", "purple", "yellow"],
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
            label:"Expenses",
            data:amounts,
            backgroundColor: ["blue", "green", "orange", "purple", "yellow"],
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
            label:"Expense by trend",
            data:amounts,
            borderColor: "rgb(75,192,192)",
        }
    ]
}

return {pieData,barData,lineData}
}
