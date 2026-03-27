import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export function getData(): ChartData<"line"> {
  return {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Steps",
        data: [2000, 2400, 1900, 2640, 3000, 1500, 3200],
        borderColor: "rgb(75,192,192)",
      },
    ],
  };
}

const data = getData();
const options = {}

const LineGraph = () => {
  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;
