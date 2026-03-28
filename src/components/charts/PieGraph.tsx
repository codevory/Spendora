import type { ChartData } from 'chart.js'
import  { Tooltip,Legend,Title,Chart as ChartJS,ArcElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useUserData } from '../../Hooks/useUserData';

ChartJS.register(
    Tooltip,
    Legend,
    Title,
    ArcElement
)

const options = {
    responsive:true,
};
const data = getPieData()

const PieGraph = () => {
    const { pieData } = useUserData()
  return (
    <Pie options={options} data={pieData}  />
  )
}

export default PieGraph


function getPieData():ChartData<"pie">{
    return {
        labels:["Facebook","twitter","instagram","Youtube","reddit"],
        datasets : [
            {
                label:"Time spent",
                data:[40,49,32,46,68],
                borderColor:"pink",
                backgroundColor:["blue","gray","pink","red","orange"],
                borderAlign:"inner",
                hoverOffset:12
            },
        ],
    }
}