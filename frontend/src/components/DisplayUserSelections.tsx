import SelectUserOrigin from "./DisplayUserOrigin";
import { useAppSelector } from "../store/store";

const DisplayUserSelections = () => {
  const userOriginDetails = useAppSelector((state) => state.origin.userOrigin);

  return (
    <div className="flex justify-center items-center rounded-xl gap-2">
      <SelectUserOrigin />
      <span>{userOriginDetails.currencySymbol ?? "₹"}</span>
    </div>
  );
};

export default DisplayUserSelections;
