import Navbar from "../Navbar";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import {
  Calendar,
  Shield,
  MessageSquare,
  ArrowRight,
  Activity,
  Users,
  Star,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-teal-50/50 via-slate-50 to-white">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-12 left-12 w-64 h-64 rounded-full bg-teal-300 blur-3xl"></div>
            <div className="absolute bottom-12 right-12 w-80 h-80 rounded-full bg-emerald-200 blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-wide mb-6">
              <Activity className="w-4 h-4 animate-pulse" />
              Next-Gen Medical Portal
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none max-w-3xl mx-auto">
              Your Health, Connected in{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Modern-Healthcare
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Instantly schedule appointments with top medical specialists. Chat
              securely with doctors and monitor your health care queue live.
            </p>

            {/* Call To Actions */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-7 py-3.5 rounded-2xl font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Find a Doctor <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/appointments"
                className="inline-flex items-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-7 py-3.5 rounded-2xl font-bold shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
              >
                Manage Bookings
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-100 pt-10">
              <div className="flex items-center gap-3 justify-center">
                <Users className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">50+</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Specialists
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Shield className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">100%</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Secure Records
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Activity className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">
                    Real-time
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Status Checks
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Star className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">4.9/5</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Care Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                Designed for Patient Convenience
              </h2>
              <p className="text-slate-500 mt-3 text-sm">
                Streamlined tools ensuring you get proper attention from top
                doctors without waiting.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left hover:border-teal-500/20 hover:bg-teal-50/10 transition-colors">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-fit mb-5">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Instant Appointments
                </h3>
                <p className="text-slate-500 mt-3 text-xs leading-relaxed">
                  Browse doctors by specialty, check their available calendar
                  schedules, and secure your booking in a few clicks.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left hover:border-teal-500/20 hover:bg-teal-50/10 transition-colors">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-fit mb-5">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Real-Time Messaging
                </h3>
                <p className="text-slate-500 mt-3 text-xs leading-relaxed">
                  Chat directly and securely with clinic support or doctors
                  before and after appointments to share concerns or updates.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left hover:border-teal-500/20 hover:bg-teal-50/10 transition-colors">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-fit mb-5">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Live Status Notifications
                </h3>
                <p className="text-slate-500 mt-3 text-xs leading-relaxed">
                  Get instant status updates (Pending, Approved, Completed) with
                  visual and sound notifications right in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
