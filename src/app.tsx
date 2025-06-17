import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { Header } from "./components/header";
import HomePage from "./pages/HomePage";
import SongPage from "./SongPage";
import AuthorList from "./AuthorList";
import SongList from "./SongList";
import AuthorPage from "./AuthorPage";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UIThemeProvider } from "./contexts/UIThemeContext";

// Create a layout component to handle common elements like Header
function RootLayout() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="w-full bg-background">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "songs",
        children: [
          {
            index: true,
            element: <SongList />,
          },
          {
            path: ":songID",
            element: <SongPage />,
          },
        ],
      },
      {
        path: "authors",
        children: [
          {
            index: true,
            element: <AuthorList />,
          },
          {
            path: ":authorID",
            element: <AuthorPage />,
          },
        ],
      },
      {
        path: "search",
        element: <SearchResults />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <UIThemeProvider>
        <RouterProvider router={router} />
      </UIThemeProvider>
    </ErrorBoundary>
  );
}
