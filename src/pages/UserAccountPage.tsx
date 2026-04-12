import { useEffect, useMemo, useState } from "react";
import type { Auth } from "firebase/auth";
import UserProfile from "../components/UserProfile";
import Layout from "../components/Layout";
import { useAppSelector } from "../store/store";
import { collection, getDocs, limit, query, where } from "firebase/firestore/lite";
import { getFirebaseServices } from "../backend/firebaseLazy";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

interface UserAccountPropsType {
  onToggle: () => void;
  isOpen: boolean;
}
interface userData {
  name: string;
  age?: number;
  email: string;
  image?: string;
}

const UserAccountPage = ({
  onToggle,
  isOpen,
}: UserAccountPropsType) => {
  const navigate = useNavigate();
  const [data, setData] = useState<userData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const transactions = useAppSelector(
    (state) => state.transaction.transactions,
  );
  const incomes = useAppSelector(
    (state) => state.incomeTransaction.incomeTransactions,
  );

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { auth, db } = await getFirebaseServices();
        setAuth(auth);


        const user = auth.currentUser;
        if (!user?.email) {
          if (isMounted) {
            setData(null);
            setError("No authenticated user found. Please sign in again.");
          }
          return;
        }

        const userQuery = query(
          collection(db, "users"),
          where("email", "==", user.email),
          limit(1),
        );

        const snapshot = await getDocs(userQuery);
        const docData = snapshot.docs[0]?.data() as
          | Partial<userData>
          | undefined;

        const resolved: userData = {
          name: docData?.name || user.displayName || "Spendora User",
          email: docData?.email || user.email,
          age: typeof docData?.age === "number" ? docData.age : undefined,
          image: docData?.image || "/default-man.webp",
        };

        if (isMounted) {
          setData(resolved);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load account",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const accountStats = useMemo(() => {
    const totalExpense = transactions.reduce((acc, txn) => acc + txn.amount, 0);
    const totalIncome = incomes.reduce((acc, txn) => acc + txn.amount, 0);
    const balance = totalIncome - totalExpense;

    return {
      totalExpense,
      totalIncome,
      balance,
      transactionCount: transactions.length,
    };
  }, [incomes, transactions]);

  const handleLogout = async () => {
    if (!auth) return;
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
    navigate("/signin");
  };

  const handleDeleteAccount = () => {
    setError(
      "Account deletion requires re-authentication. This action is not enabled yet.",
    );
  };

  return (
    <Layout onToggle={onToggle} isOpen={isOpen}>
      <div className="bg-main min-h-[calc(100vh-4rem)] p-4 md:p-6">
        {isLoading ? <Loader /> : null}

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-700 bg-linear-to-r from-slate-800 to-slate-900 p-4 md:p-6 shadow-lg">
            <p className="text-xs tracking-[0.3em] text-slate-400">ACCOUNT</p>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-100">
              Profile and preferences
            </h1>
            <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300">
              Manage your personal details and quickly review your Spendora
              account performance.
            </p>
            {error ? (
              <p className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {error}
              </p>
            ) : null}
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
            <UserProfile
              name={data?.name || "Spendora User"}
              email={data?.email || auth?.currentUser?.email || "No email"}
              image={data?.image || "/girl1.png"}
              age={data?.age}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
            />

            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 shadow-lg">
              <h2 className="text-xl font-semibold text-slate-100">
                Financial summary
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                A quick snapshot of your account activity.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Total income</p>
                  <p className="mt-1 text-xl font-bold text-emerald-300">
                    INR {accountStats.totalIncome.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Total expense</p>
                  <p className="mt-1 text-xl font-bold text-rose-300">
                    INR {accountStats.totalExpense.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Current balance</p>
                  <p
                    className={`mt-1 text-xl font-bold ${accountStats.balance >= 0 ? "text-emerald-300" : "text-rose-300"}`}
                  >
                    INR {accountStats.balance.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Transactions</p>
                  <p className="mt-1 text-xl font-bold text-slate-100">
                    {accountStats.transactionCount}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default UserAccountPage;
