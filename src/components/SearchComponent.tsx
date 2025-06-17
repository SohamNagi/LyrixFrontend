import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Music, Search, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";

// Simple debounce hook
function useDebounce(callback: (value: string) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(value), delay);
    },
    [callback, delay]
  );
}

interface SearchComponentProps {
  placeholder?: string;
  className?: string;
  showButton?: boolean;
  autoFocus?: boolean;
  onResultClick?: () => void;
}

export function SearchComponent({
  placeholder = "Search songs, authors, or lyrics...",
  className = "",
  showButton = true,
  autoFocus = false,
  onResultClick,
}: SearchComponentProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { results, loading, search, clear } = useSearch();

  const debouncedSearch = useDebounce((value: string) => {
    search(value);
  }, 300);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onResultClick?.();
    }
  };

  const handleResultClick = (href: string) => {
    navigate(href);
    setIsOpen(false);
    setQuery("");
    clear();
    onResultClick?.();
  };

  const handleClear = () => {
    setQuery("");
    clear();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setIsOpen(true)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {showButton && (
          <Button type="submit" className="ml-2" disabled={!query.trim()}>
            Search
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg"
        >
          {loading && (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="p-4 text-center text-muted-foreground">
              <p>No results found for "{query}"</p>
              <Button
                variant="link"
                size="sm"
                onClick={() =>
                  navigate(`/search?q=${encodeURIComponent(query)}`)
                }
                className="mt-1"
              >
                View all search options
              </Button>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-2">
              {/* Group results by type */}
              {results.filter((r) => r.type === "author").length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                    Authors ({results.filter((r) => r.type === "author").length}
                    )
                  </div>
                  {results
                    .filter((r) => r.type === "author")
                    .slice(0, 4)
                    .map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.href)}
                        className="w-full text-left px-3 py-3 hover:bg-muted focus:bg-muted focus:outline-none transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {result.title}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                </>
              )}
              {results.filter((r) => r.type === "song").length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                    Songs ({results.filter((r) => r.type === "song").length})
                  </div>
                  {results
                    .filter((r) => r.type === "song")
                    .slice(0, 6)
                    .map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.href)}
                        className="w-full text-left px-3 py-3 hover:bg-muted focus:bg-muted focus:outline-none transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <Music className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {result.title}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                </>
              )}

              {results.length > 8 && (
                <div className="px-3 py-2 border-t">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      navigate(`/search?q=${encodeURIComponent(query)}`)
                    }
                    className="w-full"
                  >
                    View all {results.length} results
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
