import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NotificationCenter from "./NotificationCenter";
import {
  Stethoscope,
  LogOut,
  User,
  LayoutDashboard,
  Calendar,
  Users,
} from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-xl shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent">
            MediCare +
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
            }`}
          >
            Home
          </Link>
          <Link
            to="/doctors"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive("/doctors")
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
            }`}
          >
            Doctors
          </Link>

          {user && (
            <Link
              to="/appointments"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive("/appointments")
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
              }`}
            >
              My Appointments
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {user && <NotificationCenter />}

          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile details */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 capitalize font-medium">
                  {user.role} Portal
                </span>
              </div>

              {/* Action Dropdown/Buttons */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-slate-600 hover:text-teal-700 px-3 py-2 text-sm font-semibold transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-teal-600/10 hover:shadow-teal-600/20 transition-all active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
