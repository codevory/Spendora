import  { Tooltip,Legend,Title,Chart as ChartJS,ArcElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useUserData } from '../Hooks/useUserData';

ChartJS.register(
    Tooltip,
    Legend,
    Title,
    ArcElement
)

const options = {
    responsive:true,
};

const DistributionGraph = () => {
    const { pieData } = useUserData()

    console.log(pieData)
    if(!pieData.labels?.length) {
    console.log(pieData)
      return <div className='bg-green-400 analysis-container m-4 rounded-full flex justify-center items-centerp-4'>hry ism empty</div>
    }
  return (
    <div className='chart distribution-chart'>
      <Pie  options={options} data={pieData}  />
    </div>
  )
}

export default DistributionGraph

