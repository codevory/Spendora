import { Bar } from "react-chartjs-2"
import { Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title} from "chart.js";
    import type {ChartData} from "chart.js"
import { useUserData } from "../../Hooks/useUserData";

 ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
 )

 const options = {
    responsive:true
 };
 const data = getBarChartData()


const BarGraph = () => {
    const { barData } = useUserData()
  return (
   <Bar options={options} data={barData} />
  )
}

export default BarGraph

function getBarChartData():ChartData<"bar">{
    return {
        labels:["rent","Groceries","Bills","Travel expense","Mantainance","Medical expense"],
        datasets:[
          {
            label:"Expense",
            data:[1200,400,250,430,712,340],
            backgroundColor:"red",
            borderColor:"pink",
            borderWidth:2,
            hoverBorderWidth:3
        }
        ] 
    }
}