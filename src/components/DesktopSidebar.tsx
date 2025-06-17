import { Card, CardContent } from "./ui/card";
import { Home, Music, Users, Info, Library } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "All Songs",
    url: "/songs",
    icon: Music,
  },
  {
    title: "Authors",
    url: "/authors",
    icon: Users,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
];

export function DesktopSidebar() {
  const location = useLocation();

  return (
    <Card className="h-full rounded-none border-r border-l-0 border-t-0 border-b-0">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header */}
        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.url ||
                (item.url !== "/" && location.pathname.startsWith(item.url));

              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
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
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">
            Celebrating South Asian poetry
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
