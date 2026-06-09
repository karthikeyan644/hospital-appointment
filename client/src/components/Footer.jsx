import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm">MedFlow Portal</span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-teal-600 transition-colors">
              Home
            </Link>
            <Link to="/doctors" className="hover:text-teal-600 transition-colors">
              Find Doctors
            </Link>
            <a href="#" className="hover:text-teal-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-teal-600 transition-colors">
              Support Center
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} MedFlow Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;