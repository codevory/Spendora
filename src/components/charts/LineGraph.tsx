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
} from "chart.js";
import type { ChartData } from "chart.js";
import { useUserData } from "../../Hooks/useUserData";

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
      {
        label: "Exercise",
        data: [600,900, 100, 1840, 3000, 1500, 4000],
        borderColor: "blue",
      },
      {
        label: "Running",
        data: [1200, 400, 2300, 2640, 1000, 1400, 200],
        borderColor: "red",
      },
    ],
  };
}

const data = getData();
const options = {
  responsive:true,
}

const LineGraph = () => {
  const {lineData} = useUserData()
  return (
    <div>
      <Line data={lineData} options={options} />
    </div>
  );
};

export default LineGraph;
