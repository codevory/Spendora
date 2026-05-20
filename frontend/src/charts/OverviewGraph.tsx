import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
  type ChartOptions,
} from "chart.js";
import { useUserData } from "../Hooks/useUserData";
import useThemeContext from "../Hooks/useThemeContext";
import { useAppSelector } from "../store/store";
import { formatCurrency } from "../utils/currency";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
);

const OverviewGraph = () => {
  const { barData } = useUserData();
  const { isDark } = useThemeContext();
  const currencyKey = useAppSelector((state) => state.origin.userOrigin.key);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "star" as const,
          color: isDark ? "#cbd5e1" : "slate",
          boxWidth: 10,
          padding: 15,
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
        callbacks: {
          label: (context) =>
            ` ${context.dataset.label ?? "Value"}: ${formatCurrency(Number(context.parsed.y), currencyKey)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: isDark ? "#94a3b8" : " slate",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: isDark ? "#94a3b8" : "slate",
          callback: (value) => formatCurrency(Number(value), currencyKey),
        },
      },
    },
  } satisfies ChartOptions<"bar">;

  const enhancedData = {
    ...barData,
    datasets: barData.datasets.map((dataset) => ({
      ...dataset,
      borderRadius: 10,
      borderSkipped: false as const,
      maxBarThickness: 46,
    })),
  };

  return (
    <div className="chart overview-graph min-h-80 rounded-xl border border-slate-700 bg-slate-900/50 p-3 md:p-4">
      <Bar options={options} data={enhancedData} />
    </div>
  );
};

export default OverviewGraph;
