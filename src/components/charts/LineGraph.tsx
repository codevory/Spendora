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
