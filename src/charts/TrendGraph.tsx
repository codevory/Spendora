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
import { useUserData } from "../Hooks/useUserData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive:true,
}

const TrendGraph = () => {
  const {lineData} = useUserData()
  return (
    <div className="chart trend-graph">
      <Line  data={lineData} options={options} />
    </div>
  );
};

export default TrendGraph;
