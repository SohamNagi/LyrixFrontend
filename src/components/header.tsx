import { SearchComponent } from "./SearchComponent";
import ModeToggle from "./modeToggle";
import { Music, Users, Info } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useUITheme } from "@/hooks/use-ui-theme";

function HeaderContent() {
  const location = useLocation();
  const { theme } = useUITheme();

  const navItems = [
    { title: "Songs", url: "/songs", icon: Music },
    { title: "Authors", url: "/authors", icon: Users },
    { title: "About", url: "/about", icon: Info },
  ];

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-primary/20 transition-colors"
        >
          <img
            src="/favicon_dark.png"
            alt="Lyrix"
            className={`h-7 w-7 transition-all duration-200 ${
              theme === "dark" ? "invert" : ""
            }`}
          />
          <span className="font-bold text-lg">Lyrix</span>
        </Link>
      </div>

      {/* Navigation - Hidden on mobile */}
      <nav className="hidden md:flex items-center space-x-1 mr-6">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.url ||
            (item.url !== "/" && location.pathname.startsWith(item.url));

          return (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Right side - Search and Mode Toggle */}
      <div className="flex items-center space-x-3">
        <SearchComponent
          className=" w-full min-w-80 h-10"
          showButton={false}
          placeholder="Search songs, authors, or lyrics..."
        />
        <ModeToggle />
      </div>
    </>
  );
}

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="flex h-16 items-center px-4">
        <HeaderContent />
      </div>
    </header>
  );
}
