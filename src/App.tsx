import React, { useState, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import EmptyState from "./components/EmptyState";

const DashBoardLayout = React.lazy(() => import("./pages/DashBoardLayout"));
const TransactionLayout = React.lazy(() => import("./pages/TransactionLayout"));
const CategoriesPage = React.lazy(() => import("./pages/CategoriesPage"));
const AnalyticsPage = React.lazy(() => import("./pages/AnalyticsPage"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Signin = React.lazy(() => import("./pages/Signin"));
const UserAccountPage = React.lazy(() => import("./pages/UserAccountPage"));

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Suspense fallback={<Loader />}>
      <>
        <div>
          <Routes>
            <Route
              path="/transactions/tnx-details/:id"
              element={
                <TransactionLayout
                  isOpen={isOpen}
                  onToggle={() => setIsOpen((p) => !p)}
                />
              }
            />
            <Route
              path="/"
              element={
                <DashBoardLayout
                  isLoggedin={true}
                  isOpen={isOpen}
                  onToggle={() => setIsOpen((p) => !p)}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <TransactionLayout
                  isOpen={isOpen}
                  onToggle={() => setIsOpen((p) => !p)}
                />
              }
            />
            <Route
              path="/categories"
              element={
                <CategoriesPage
                  isOpen={isOpen}
                  onToggle={() => setIsOpen((p) => !p)}
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <AnalyticsPage
                  isOpen={isOpen}
                  onToggle={() => setIsOpen((p) => !p)}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <Signup isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />
              }
            />
            <Route
              path="/signin"
              element={
                <Signin isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />
              }
            />
            <Route
              path="/me"
              element={
                <UserAccountPage
                  isLoggedin={false}
                  isOpen={isOpen}
                  onToggle={() => setIsOpen((p) => !p)}
                />
              }
            />
            <Route path="*" element={<EmptyState content="No page found" /> } />
          </Routes>
          <Outlet />
          <Toaster />
          <Analytics />
        </div>
      </>
    </Suspense>
  );
}

export default App;
