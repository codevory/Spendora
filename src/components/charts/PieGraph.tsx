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

const PieGraph = () => {
    const { pieData } = useUserData()
  return (
    <Pie options={options} data={pieData}  />
  )
}

export default PieGraph

