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
import { Backend_Url } from "./store/features/transactionApi";
import { useAppDispatch } from "./store/store";
import { setCsrf } from "./store/features/userAuthenication";
const DashBoardLayout = React.lazy(() => import("./pages/DashBoardLayout"));

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsOpen((p) => !p);
  const dispatch = useAppDispatch()

  useEffect(() => {
  async function getCsrf() {
  try {
    const data = await fetch(`${Backend_Url}/api/auth/csrf`, {
      credentials:"include"
    })
    if(!data.ok){
      console.log("no-csrf-cookie-found-server")
    }

    const token = await data.json()
    const csrf = token.csrf
    dispatch(setCsrf(csrf))
  } catch (error) {
    console.error("internal server error")
  }
}
getCsrf()
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

          {/* Fallback Catch-All */}
          <Route path="*" element={<EmptyState content="No page found" />} />
        </Routes>
        <Outlet />
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;