import  { Tooltip,Legend,Title,Chart as ChartJS,ArcElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useUserData } from '../Hooks/useUserData';
import EmptyState from '../components/EmptyState';

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

    if(!pieData.labels?.length) {
      return <EmptyState content=<div className='empty-state'>{"Nothing to display"}</div> />
    }
  return (
    <div className='chart distribution-chart'>
      <Pie  options={options} data={pieData}  />
    </div>
  )
}

export default DistributionGraph

