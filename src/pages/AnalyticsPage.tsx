import DistributionGraph from '../charts/DistributionGraph';
import TrendGraph from '../charts/TrendGraph';
import Layout from '../components/Layout'
import MonthlyInsights from '../components/MonthlyInsights';
import RecentTransactions from '../components/RecentTransactions';
import { useUserData } from '../Hooks/useUserData';

interface AnalyticsPropsType {
    onToggle:() => void;
    isOpen:boolean;
}
const AnalyticsPage = ({onToggle,isOpen}:AnalyticsPropsType) => {

  const {analysisData} = useUserData()
  return (
    <div className='bg-main'>
        <Layout onToggle={onToggle} isOpen={isOpen}>
       <div className='flex flex-col gap-1'>
        <div className='flex gap-2'>

          <div className='h-100 overflow-y-scroll w-1/2'>
            <RecentTransactions />
          </div>
      
          <div className='w-2/3'>
            <TrendGraph data={analysisData} />
          </div>

        </div>
    
         <div className='flex w-full bg-yellow-950'>
          <div className='h-full w-auto'>
            <DistributionGraph />
          </div>
          <div className='w-2/3 bg-green-500 '>
          <MonthlyInsights />
          </div>
         </div>
       </div>

        </Layout>
      
    </div>
  )
}

export default AnalyticsPage
