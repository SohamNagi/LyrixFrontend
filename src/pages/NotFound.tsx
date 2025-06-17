import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft, Music } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-12">
          {/* 404 Icon */}
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="h-12 w-12 text-primary" />
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. The song or
            content you're seeking might have been moved or doesn't exist.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild>
                <Link to="/songs">
                  <Music className="mr-2 h-4 w-4" />
                  Browse Songs
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Link>
              </Button>
            </div>

            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for something specific?
            </p>
            <div className="space-y-1">
              <Link
                to="/authors"
                className="text-sm text-primary hover:underline block"
              >
                Explore Authors & Lyricists
              </Link>
              <Link
                to="/songs"
                className="text-sm text-primary hover:underline block"
              >
                Discover Song Library
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
