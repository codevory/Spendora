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
import useThemeContext from "../Hooks/useThemeContext";
import { useAppSelector } from "../store/store";
import { formatCurrency } from "../utils/currency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface TrendGraphPropsType {
  data: ChartData<"line">;
}
const TrendGraph = ({ data }: TrendGraphPropsType) => {
  const { isDark } = useThemeContext();
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);
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
          pointStyle: "star" as const,
          color: isDark ? "#cbd5e1" : "#334155",
          padding: 15,
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(15, 23, 42, 0.96)"
          : "rgba(248, 250, 252, 0.98)",
        titleColor: isDark ? "#f8fafc" : "#0f172a",
        bodyColor: isDark ? "#e2e8f0" : "#334155",
        borderColor: isDark
          ? "rgba(148, 163, 184, 0.25)"
          : "rgba(148, 163, 184, 0.4)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) =>
            ` ${formatCurrency(Number(context.parsed.y), currencyKey)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.12)",
        },
        ticks: {
          color: isDark ? "#94a3b8" : "slate",
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
          color: isDark ? "#94a3b8" : "slate",
          callback: (value) => formatCurrency(Number(value), currencyKey),
        },
      },
    },
  } satisfies ChartOptions<"line">;

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
