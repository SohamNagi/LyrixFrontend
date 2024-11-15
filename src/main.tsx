import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { injectAnalytics } from "@vercel/analytics/sveltekit";
import "./index.css";

import App from "./app.tsx";
injectSpeedInsights();
injectAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
