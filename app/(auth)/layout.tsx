import Link from "next/link";
import { Newspaper } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <Newspaper className="h-5 w-5 text-brand-600" />
            News<span className="text-brand-600">AI</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
