import  { Tooltip,Legend,Title,Chart as ChartJS,ArcElement,Filler, type ChartOptions } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useUserData } from '../Hooks/useUserData';
import EmptyState from '../components/EmptyState';

ChartJS.register(
    Tooltip,
    Legend,
    Title,
    ArcElement,
    Filler
)

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 14,
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.96)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(148, 163, 184, 0.25)',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.label ?? 'Category';
            const value = Number(context.parsed ?? 0);
            return `${label}: ₹${value.toLocaleString('en-IN')}`;
          },
        },
      },
    },
} satisfies ChartOptions<'pie'>;

const DistributionGraph = () => {
    const { pieData } = useUserData()

    if(!pieData.labels?.length) {
      return <EmptyState content={<div className='empty-state'>{"Nothing to display"}</div>} />
    }
  return (
    <div className='chart distribution-chart min-h-80 rounded-2xl border border-slate-700 bg-slate-900/50 p-3 md:p-4'>
      <Pie  options={options} data={pieData}  />
    </div>
  )
}

export default DistributionGraph

