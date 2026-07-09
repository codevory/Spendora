import React, { useState, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import EmptyState from "./components/EmptyState";
import SkeletalLoader from "./components/SkeletonLoader";
import { LandingPage } from "./pages/LandingPage";
import ProtectedRoute from "./components/protectedRoute"; // <-- Import your guard component

const DashBoardLayout = React.lazy(() => import("./pages/DashBoardLayout"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Signin = React.lazy(() => import("./pages/Signin"));
const UserAccountPage = React.lazy(() => import("./pages/UserAccountPage"));
const TransactionLayout = React.lazy(() => import("./pages/TransactionLayout"));
const AnalyticsPage = React.lazy(() => import("./pages/AnalyticsPage"));
const CategoriesPage = React.lazy(() => import("./pages/CategoriesPage"));

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsOpen((p) => !p);

  return (
    <>
      <Suspense fallback={<SkeletalLoader />}>
        <Routes>
          {/* =========================================================
             1. PUBLIC ROUTES (Anyone can visit)
             ========================================================= */}
          <Route path="/welcome" element={<LandingPage />} />
          <Route
            path="/signup"
            element={<Signup isOpen={isOpen} onToggle={toggleSidebar} />}
          />
          <Route
            path="/signin"
            element={<Signin isOpen={isOpen} onToggle={toggleSidebar} />}
          />

          {/* =========================================================
             2. PROTECTED ROUTES (Requires authentication)
             ========================================================= */}
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
                <TransactionLayout isOpen={isOpen} onToggle={toggleSidebar} />
              }
            />
            <Route
              path="/transactions/tnx-details/:id"
              element={
                <TransactionLayout isOpen={isOpen} onToggle={toggleSidebar} />
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