import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SongCardSkeletonProps {
  count?: number;
}

export function SongCardSkeleton({ count = 12 }: SongCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1">
              <div className="mt-auto">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

interface AuthorCardSkeletonProps {
  count?: number;
}

export function AuthorCardSkeleton({ count = 12 }: AuthorCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-start gap-3">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              <Skeleton className="h-4 w-16" />
              <div className="mt-auto">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
