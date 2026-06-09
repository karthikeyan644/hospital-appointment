import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 text-center">
      <div className="p-4 bg-teal-50 text-teal-600 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-800 tracking-tight">404</h1>
      <p className="mt-4 text-slate-500 text-sm max-w-xs">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-teal-600/10 cursor-pointer"
      >
        Go back to Home
      </Link>
    </div>
  );
}

export default NotFound;