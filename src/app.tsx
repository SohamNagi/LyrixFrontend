import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import HeroSearch from "./components/heroSearch";
import SongPage from "./songPage";
import AuthorList from "./authorList";
import SongList from "./SongList";
import AuthorPage from "./authorPage";

// Create a layout component to handle common elements like Navbar and Footer
function RootLayout() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar />
      <div className="flex-grow flex justify-center">
        <Outlet /> {/* Outlet renders the matched child route */}
      </div>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Apply the layout for all child routes
    children: [
      {
        index: true, // This is the default route for "/"
        element: (
          <div className="self-center">
            <HeroSearch />
          </div>
        ),
      },
      {
        path: "songs",
        children: [
          {
            index: true, // This matches "/songs"
            element: <SongList />,
          },
          {
            path: ":songID", // This matches "/songs/:songID"
            element: <SongPage />,
          },
        ],
      },
      {
        path: "authors",
        children: [
          {
            index: true, // This matches "/authors"
            element: <AuthorList />,
          },
          {
            path: ":authorID", // This matches "/authors/:authorID"
            element: <AuthorPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
