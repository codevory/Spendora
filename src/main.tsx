import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react"
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Store from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={Store}>
        <App />
        <SpeedInsights />
        <Analytics />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
