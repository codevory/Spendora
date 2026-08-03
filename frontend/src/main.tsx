import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Store from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";
import { initGlobalErrorHandling } from "./utils/initGlobalErrorHandling.ts";
import { GlobalErrorBoundary } from "./components/GlobalErrorHandler.tsx";
import { ErrorFallbackUi } from "./components/ErrorFallbackUi.tsx";

initGlobalErrorHandling()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalErrorBoundary fallback={<ErrorFallbackUi />}>
    <BrowserRouter>
      <Provider store={Store}>
        <App />
        <SpeedInsights />
        <Analytics />
      </Provider>
    </BrowserRouter>
    </GlobalErrorBoundary>
  </StrictMode>,
);
