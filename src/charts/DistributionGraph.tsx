import {
  Tooltip,
  Legend,
  Title,
  Chart as ChartJS,
  ArcElement,
  Filler,
  type ChartOptions,
} from "chart.js";
import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { useUserData } from "../Hooks/useUserData";
import useThemeContext from "../Hooks/useThemeContext";
import EmptyState from "../components/EmptyState";

ChartJS.register(Tooltip, Legend, Title, ArcElement, Filler);

const DistributionGraph = () => {
  const { pieData } = useUserData();
  const { isDark } = useThemeContext();

  const options = useMemo(
    () =>
      ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom" as const,
            labels: {
              color: isDark ? "#cbd5e1" : "#334155",
              usePointStyle: true,
              pointStyle: "circle" as const,
              padding: 14,
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
            callbacks: {
              label: (context) => {
                const label = context.label ?? "Category";
                const value = Number(context.parsed ?? 0);
                return `${label}: ₹${value.toLocaleString("en-IN")}`;
              },
            },
          },
        },
      }) satisfies ChartOptions<"pie">,
    [isDark],
  );

  if (!pieData.labels?.length) {
    return (
      <EmptyState
        content={<div className="chart-empty-state">{"Nothing to display"}</div>}
      />
    );
  }
  return (
    <div className="chart distribution-chart min-h-80 rounded-2xl border border-slate-700 bg-slate-900/50 p-3 md:p-4">
      <Pie options={options} data={pieData} />
    </div>
  );
};

export default DistributionGraph;
