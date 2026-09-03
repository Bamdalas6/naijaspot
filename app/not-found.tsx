import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen p-6 text-center bg-sky-gradient">
      <div className="bg-white rounded-[32px] p-8 max-w-sm shadow-xl border border-sky-100 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#e8f6ff] text-[#0284c7] flex items-center justify-center mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Spot Not Found</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          The page or spot you were looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3 rounded-2xl shadow-md text-xs transition-all"
        >
          Return to Discover
        </Link>
      </div>
    </div>
  );
}
