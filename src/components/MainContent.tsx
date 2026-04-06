import HeaderCards from './HeaderCards'
import { useState } from 'react'
import AddTransactionForm from "../components/AddTransactionForm"
import RecentTransactions from "../components/RecentTransactions"
import DistributionGraph from '../charts/DistributionGraph'
import OverviewGraph from '../charts/OverviewGraph'
import TrendGraph from '../charts/TrendGraph'
import MobileMenu from './MobileMenu'

interface MainContentPropsType {
  setShowModal:(show:boolean) => void;
}

const MainContent = ({setShowModal}:MainContentPropsType) => {
const [activeGraph,setActiveGraph] = useState<string>("bar")

  return (
      <div className=" bg-main ">

      <div className='flex flex-col justify-center '>
        <div className='flex flex-col gap-2'>
            <div className=' mt-3 mx-3'>
             <HeaderCards />
            </div>


       <div className="hero-content b">  
        
        <div className='flex flex-col justify-between chart-container gap-3 '>
            <div className='buttons-tab'>
              <button onClick={() => setActiveGraph("bar")} 
              className={`${activeGraph === "bar" ? "active-graphTab" : ""}   graph-buttons`}>Overview</button> 
              <button onClick={() => setActiveGraph("pie")} 
              className={`${activeGraph === "pie" ? "active-graphTab" : ""}   graph-buttons`}>Distribution</button> 
              <button onClick={() => setActiveGraph("line")} 
              className={`${activeGraph === "line" ? "active-graphTab" : ""}   graph-buttons`}>Trend</button>
            </div>
          <div className='analysis-container overflow-x-scroll'>
              {activeGraph === "pie" ? <DistributionGraph /> : 
              activeGraph === "bar" ? <OverviewGraph /> : <TrendGraph />}
          </div>

      </div>

        <div className='form-container'>
          <AddTransactionForm setShowModal={setShowModal} />
        </div>

        <div className='calender'>
          <div className='header flex justify-center font-bold'>
            <h2>7 days preview</h2>
          </div>
        </div>

      </div>

        <div className='transactions-box overflow-y-scroll h-60'>
            <RecentTransactions />
        </div>

      </div>

      </div>

    <MobileMenu />
      </div>

  )
}
export default MainContent