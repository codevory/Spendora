import { Bar } from "react-chartjs-2"
import { Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title} from "chart.js";
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


const BarGraph = () => {
    const { barData } = useUserData()
  return (
   <Bar options={options} data={barData} />
  )
}

export default BarGraph