import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="text-6xl font-bold text-brand-600">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Story not found</h1>
        <p className="mt-1 text-sm text-neutral-500">
          The article you were looking for may have been moved or removed.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/home">
            <Button>Back to feed</Button>
          </Link>
          <Link href="/search">
            <Button variant="outline">Search</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
