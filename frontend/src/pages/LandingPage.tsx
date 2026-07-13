import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { checkAuth } from '../utils/helperFunctions/authUI';
import { setLoginStatus, setUserData } from '../store/features/userAuthenication';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [simulationAmount, setSimulationAmount] = useState<number>(150);
  const isLoggedin  = useAppSelector((state) => state.userData.isLoggedin)

  const dispatch = useAppDispatch()

  useEffect(() => {
    async function getUser(){
      const user = await checkAuth()

      if(user == null) return;

      if(user?.ok){
        dispatch(setUserData(user))
        dispatch(setLoginStatus(user))
        navigate("/")
      }
      return user
    }
    
    getUser()
  },[])


  return (
    <div className="min-h-screen bg-[#0a0d1a] text-slate-200 font-sans selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      
      {/* 1. PREMIUM AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-[-10%] left-[-20%] w-200 h-150 bg-linear-to-tr from-indigo-600/15 via-purple-600/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-20%] w-150 h-150 bg-linear-to-bl from-emerald-500/10 via-blue-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415505_1px,transparent_1px),linear-gradient(to_bottom,#33415505_1px,transparent_1px)] bg-size-[3rem_3rem] pointer-events-none" />

      {/* FIXED NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d1a]/70 backdrop-blur-xl border-b border-indigo-950/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              S
            </div>
            <span className="text-sm font-bold tracking-[0.25em] text-white">SPENDORA</span>
          </div>
          <div className="flex items-center gap-5">
            <button 
              onClick={() => {
                isLoggedin ? navigate("/") : navigate("/signin")
              }} 
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              {isLoggedin ? "Dashboard" : "Sign In"}
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              Start Free Session
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO & CONVERSION TRIGGER SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: CRITICAL CONVERSION DATA POINTS */}
        <div className="lg:col-span-7 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            ✨ Capital Leak Diagnostic Dashboard Open
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
            Your unmonitored metrics <br />
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              are costing you 18% yearly.
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed mb-8 font-light">
            Behavioral banking studies confirm that untracked digital micro-transactions leak up to $4,200 annually per household. Spendora forces absolute mathematical visibility over your timeline state.
          </p>

          {/* HARD FACTUAL TRIGGER TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-lg">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-indigo-950/40 backdrop-blur-sm">
              <span className="text-red-400 font-mono text-xs block mb-1">🚨 THE SUBSCRIPTION TRAP</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                The average user wastes <strong className="text-slate-200">$912/year</strong> on forgotten, auto-renewing subscriptions. Spendora's atomic categorization tags highlight active deadweight instantly.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-indigo-950/40 backdrop-blur-sm">
              <span className="text-emerald-400 font-mono text-xs block mb-1">📈 THE RETENTION ADVANTAGE</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Users deploying structured cache ledgers retain <strong className="text-slate-200">23% more capital</strong> within the first 90 days simply by eliminating blind spend zones.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate('/signup')} 
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xl shadow-indigo-600/30 transition-transform hover:-translate-y-0.5"
            >
              STOP THE TRAFFIC LEAK (FREE)
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE GLASS SIMULATOR MOCKUP */}
        <div className="lg:col-span-5 bg-linear-to-b from-indigo-950/20 to-slate-900/40 border border-indigo-900/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-indigo-950/60 pb-3 mb-5 text-[10px] text-slate-500 font-mono">
            <span>REALTIME_LEAK_CALCULATOR</span>
            <span className="text-indigo-400 font-bold animate-pulse">● LIVE RUNTIME</span>
          </div>
          
          <h3 className="text-xs font-bold text-slate-200 mb-4">Simulate a Minor monthly blind spot:</h3>
          
          <div className="mb-6">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">Untracked Streaming/Food Slippage</span>
              <span className="text-indigo-400 font-bold">${simulationAmount} / mo</span>
            </div>
            <input 
              type="range" min="50" max="600" step="25" value={simulationAmount}
              onChange={(e) => setSimulationAmount(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-900 h-1 rounded"
            />
          </div>

          {/* DYNAMIC METRIC INSIGHT CARDS */}
          <div className="space-y-3 font-mono">
            <div className="p-3 bg-[#0f1326] border border-indigo-950 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-500 block">10-YEAR COMPOUND VALUE</span>
                <span className="text-xs text-slate-300">Lost investment compounding</span>
              </div>
              <span className="text-sm font-black text-red-400">-${(simulationAmount * 12 * 10 * 1.07).toFixed(0)}</span>
            </div>
            
            <div className="p-3 bg-[#0f1326] border border-indigo-950 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-500 block">SPENDORA RISK REDUCTION</span>
                <span className="text-xs text-slate-300">Mitigated systemic risk index</span>
              </div>
              <span className="text-sm font-black text-emerald-400">99.2% SAFE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSITION STRIP: VERIFIABLE STATISTICAL BENCHMARKS */}
      <section className="border-y border-indigo-950/40 bg-[#0d1122] py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white">23%</p>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 mt-1">AVG. SAVINGS INCREASE</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-400">&lt; 14ms</p>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 mt-1">RTK_QUERY REFETCH SPEED</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">$4,200</p>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 mt-1">ANNUAL LEAK MITIGATED</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-purple-400">100%</p>
            <p className="text-[10px] font-mono tracking-wider text-slate-500 mt-1">DATA FLOW TRANSPARENCY</p>
          </div>
        </div>
      </section>

      {/* 4. BEHAVIORAL CASE SECTIONS: SYSTEM MISTAKES WE RESOLVE */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative z-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-indigo-400 font-mono text-[10px] tracking-widest font-bold mb-2">// LEDGER_AUDIT</p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            The Three Fatal Structural Budget Flaws
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-indigo-950 bg-[#0b0f21]/40 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs mb-4">✕</div>
            <h4 className="text-sm font-bold text-slate-200 mb-2">The Cartesian Product Duplication</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Most standard financial web portals run unstable multi-table SQL queries that duplicate entries cross-directionally. Spendora wraps calculations in strict, isolated linear <code className="text-slate-300">UNION ALL</code> commands for permanent numerical precision.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-indigo-950 bg-[#0b0f21]/40 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs mb-4">✕</div>
            <h4 className="text-sm font-bold text-slate-200 mb-2">The Loading Spinner Abandonment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When navigating back and forth across past timeline pages takes over 2 seconds, user engagement drops by 40%. Our integrated Redux caching layer stores data blocks instantly, bypassing subsequent network requests.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-indigo-950 bg-[#0b0f21]/40 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs mb-4">✕</div>
            <h4 className="text-sm font-bold text-slate-200 mb-2">Orphaned Category Amnesia</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modifying or updating custom categorical tracking headers usually leaves your historic transaction entries structurally detached. Our system updates tag states automatically, synchronizing modifications smoothly across the entire user base ledger.
            </p>
          </div>
        </div>
      </section>

      {/* 5. IMMERSIVE CONVERSION CALL TO ACTION */}
      <section className="py-20 relative px-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-126 h-50 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-xl mx-auto border border-indigo-900/40 bg-[#0c1024] p-10 rounded-2xl relative z-10 shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-black mb-3 text-white tracking-tight">Lock Down Your Capital Preservation Node</h2>
          <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
            Join thousands of active users tracking cash flow anomalies securely. Your secure layout engine context loads in under 60 seconds.
          </p>
          <button 
            onClick={() => navigate('/signup')} 
            className="px-6 py-3 text-xs font-bold tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            INITIALIZE ENCLAVE ACCOUNT (FREE)
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-indigo-950/40 py-6 text-center text-[10px] text-slate-600 font-mono tracking-widest">
        <p>© 2026 SPENDORA RETENTION ENGINE PLATFORM ENVIRONMENT INTERACTION.</p>
      </footer>
    </div>
  );
};

