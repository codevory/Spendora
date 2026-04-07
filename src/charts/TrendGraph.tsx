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
  type ChartData,
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
interface TrendGraphPropsType {
  data:ChartData<"line">;
}
const TrendGraph = ({data}:TrendGraphPropsType) => {
  const {lineData} = useUserData()
  return (
    <div className="chart trend-graph">
      <Line  data={data} options={options} />
    </div>
  );
};

export default TrendGraph;
