import React, { useState, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import EmptyState from "./components/EmptyState";
import SkeletalLoader from "./components/SkeletonLoader";
import { LandingPage } from "./pages/LandingPage";
import ProtectedRoute from "./components/protectedRoute"; 
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import UserAccountPage from "./pages/UserAccountPage";
import TransactionsPage from "./pages/TransactionsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CategoriesPage from "./pages/CategoriesPage";
import { getCsrf } from "./utils/authService";
import { useAppDispatch } from "./store/store";
const DashBoardLayout = React.lazy(() => import("./pages/DashBoardLayout"));

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const toggleSidebar = () => setIsOpen((p) => !p);

  useEffect(() => {
    getCsrf(dispatch)
  },[])

  return (
    <>
      <Suspense fallback={<SkeletalLoader />}>
        <Routes>

          <Route path="/welcome" element={<LandingPage />} />
          <Route
            path="/signup"
            element={<Signup isOpen={isOpen} onToggle={toggleSidebar} />}
          />
          <Route
            path="/signin"
            element={<Signin isOpen={isOpen} onToggle={toggleSidebar} />}
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <DashBoardLayout
                  isLoggedin={true}
                  isOpen={isOpen}
                  onToggle={toggleSidebar}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <TransactionsPage isOpen={isOpen} onToggle={toggleSidebar} />
              }
            />
            <Route
              path="/transactions/tnx-details/:id"
              element={
                <TransactionsPage isOpen={isOpen} onToggle={toggleSidebar} />
              }
            />
            <Route
              path="/categories"
              element={
                <CategoriesPage isOpen={isOpen} onToggle={toggleSidebar} />
              }
            />
            <Route
              path="/analytics"
              element={
                <AnalyticsPage isOpen={isOpen} onToggle={toggleSidebar} />
              }
            />
            <Route
              path="/me"
              element={
                <UserAccountPage isOpen={isOpen} onToggle={toggleSidebar} />
              }
            />
          </Route>
          <Route path="*" element={<EmptyState content="No page found" position={50} />} />
        </Routes>
        <Outlet />
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;