import { Bar } from "react-chartjs-2"
import { Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
   Title,
   type ChartOptions} from "chart.js";
import { useUserData } from "../Hooks/useUserData";

 ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
 )

 const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            position: "bottom" as const,
            labels: {
               color: "#cbd5e1",
               boxWidth: 12,
               padding: 16,
            },
         },
         tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.96)",
            titleColor: "#f8fafc",
            bodyColor: "#e2e8f0",
            borderColor: "rgba(148, 163, 184, 0.25)",
            borderWidth: 1,
            callbacks: {
               label: (context) => ` ${context.dataset.label ?? "Value"}: ₹${Number(context.parsed.y).toLocaleString("en-IN")}`,
            },
         },
      },
      scales: {
         x: {
            grid: {
               color: "rgba(148, 163, 184, 0.1)",
            },
            ticks: {
               color: "#94a3b8",
            },
         },
         y: {
            beginAtZero: true,
            grid: {
               color: "rgba(148, 163, 184, 0.1)",
            },
            ticks: {
               color: "#94a3b8",
               callback: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
            },
         },
      },
 } satisfies ChartOptions<"bar">;


const OverviewGraph = () => {
    const { barData } = useUserData()

      const enhancedData = {
         ...barData,
         datasets: barData.datasets.map((dataset) => ({
            ...dataset,
            borderRadius: 10,
            borderSkipped: false as const,
            maxBarThickness: 46,
         })),
      }

  return (
    <div className="chart overview-graph min-h-80 rounded-2xl border border-slate-700 bg-slate-900/50 p-3 md:p-4">
         <Bar options={options} data={enhancedData} />
   </div>
  )
}

export default OverviewGraph