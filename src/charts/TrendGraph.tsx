import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle" as const,
        color: "#cbd5e1",
        padding: 16,
        boxWidth: 10,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.96)",
      titleColor: "#f8fafc",
      bodyColor: "#e2e8f0",
      borderColor: "rgba(148, 163, 184, 0.25)",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context) => ` ₹${Number(context.parsed.y).toLocaleString("en-IN")}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(148, 163, 184, 0.12)",
      },
      ticks: {
        color: "#94a3b8",
        font: {
          size: 11,
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(148, 163, 184, 0.12)",
      },
      ticks: {
        color: "#94a3b8",
        callback: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
      },
    },
  },
} satisfies ChartOptions<"line">;
interface TrendGraphPropsType {
  data:ChartData<"line">;
}
const TrendGraph = ({data}:TrendGraphPropsType) => {
  return (
    <div className="chart trend-graph min-h-80 rounded-2xl border border-slate-700 bg-slate-900/50 p-3 md:p-4">
      <Line
        data={{
          ...data,
          datasets: data.datasets.map((dataset, index) => ({
            ...dataset,
            tension: 0.42,
            fill: index === data.datasets.length - 1,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBorderWidth: 2,
            pointBackgroundColor: "#0f172a",
            borderWidth: 3,
          })),
        }}
        options={options}
      />
    </div>
  );
};

export default TrendGraph;
