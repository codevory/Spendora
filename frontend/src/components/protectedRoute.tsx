import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useAppSelector } from "../store/store"; // Adjust this path to match your setup

const ProtectedRoute = () => {
  const { isLoggedin ,isLoading} = useAppSelector((state) => state.userData);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
        <p>Verifying session...</p>
      </div>
    );
  }

      if (!isLoggedin) {
        return <Navigate to="/welcome" state={{from:location}} replace />
      }

     return <Outlet />
};

export default ProtectedRoute;