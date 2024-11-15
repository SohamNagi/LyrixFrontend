import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <p></p>,
  },
  {
    path: "/:songID",
    element: <div></div>,
  },
  {
    path: "/songs",
    element: <div></div>,
  },
]);

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Analytics />
      <SpeedInsights />
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <RouterProvider router={router} />
      </div>
      <Footer />
    </div>
  );
}
