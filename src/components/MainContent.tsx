import HeaderCards from './HeaderCards'
import { useState } from 'react'
import AddTransactionForm from "../components/AddTransactionForm"
import RecentTransactions from "../components/RecentTransactions"
import SidebarMenu from "../components/SidebarMenu"
import DistributionGraph from '../charts/DistributionGraph'
import OverviewGraph from '../charts/OverviewGraph'
import TrendGraph from '../charts/TrendGraph'
import MobileMenu from './MobileMenu'

interface MainContentPropsType {
    isOpen:boolean
}

const MainContent = ({isOpen}:MainContentPropsType) => {
const [activeGraph,setActiveGraph] = useState<string>("bar")

  return (
      <div className="w-full flex gap-5 justify-center bg-main overflow-hidden">

      <div className={` ${isOpen ? 'w-[14%] transform-content' : 'w-[6%] transform-content -transate-x-20' } sidebar bg-green-900`}>
      <SidebarMenu isOpen={isOpen} />
      </div> 

      <div className='flex flex-col justify-center w-full '>
        <div className='flex flex-col gap-2'>
            <div className=''>
             <HeaderCards />
            </div>


       <div className="hero-content b">  
        
        <div className='flex flex-col chart-container gap-3 '>
            <div className='buttons-tab'>
              <button onClick={() => setActiveGraph("bar")} 
              className={`${activeGraph === "bar" ? "active-graphTab" : ""}   graph-buttons`}>Overview</button> 
              <button onClick={() => setActiveGraph("pie")} 
              className={`${activeGraph === "pie" ? "active-graphTab" : ""}   graph-buttons`}>Distribution</button> 
              <button onClick={() => setActiveGraph("line")} 
              className={`${activeGraph === "line" ? "active-graphTab" : ""}   graph-buttons`}>Trend</button>
            </div>
          <div className='analysis-container'>
              {activeGraph === "pie" ? <DistributionGraph /> : 
              activeGraph === "bar" ? <OverviewGraph /> : <TrendGraph />}
          </div>

      </div>

        <div className='form-container'>
          <AddTransactionForm />
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