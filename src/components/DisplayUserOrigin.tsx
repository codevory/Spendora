import { useAppSelector } from "../store/store";

const DisplayUserOrigin = () => {
  const userOriginDetails = useAppSelector((state) => state.origin.userOrigin);

  return (
    <div className="origin-pill flex h-9 min-w-20 items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/50 px-2 text-sm font-medium text-slate-100">
      <span>{userOriginDetails.key ? userOriginDetails.key : "IN"}</span>
      <span>{userOriginDetails.currencySymbol ? userOriginDetails.currencySymbol : "₹"}</span>
    </div>
  );
};

export default DisplayUserOrigin
