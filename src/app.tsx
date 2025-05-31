import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Header } from "./components/header";
import HomePage from "./pages/HomePage";
import SongPage from "./SongPage";
import AuthorList from "./AuthorList";
import SongList from "./SongList";
import AuthorPage from "./AuthorPage";

// Create a layout component to handle common elements like Sidebar and Header
function RootLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <Header />
        <main className="min-h-screen bg-background">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
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
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
