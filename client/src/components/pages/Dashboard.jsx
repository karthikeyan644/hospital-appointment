import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import appointmentService from "../services/appointmentService";
import doctorService from "../services/doctorService";
import ChatWindow from "../ChatWindow";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Activity,
  CalendarDays,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Briefcase,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

function Dashboard() {
  const { user, socket } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // { id, name }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Set up real-time socket listeners for incoming bookings/updates
  useEffect(() => {
    if (!socket) return;

    const handleNewAppointment = (newApp) => {
      setAppointments((prev) => [newApp, ...prev]);
    };

    const handleAppointmentUpdated = (updatedApp) => {
      setAppointments((prev) =>
        prev.map((app) => (app._id === updatedApp._id ? updatedApp : app))
      );
    };

    socket.on("new_appointment", handleNewAppointment);
    socket.on("appointment_updated", handleAppointmentUpdated);

    return () => {
      socket.off("new_appointment", handleNewAppointment);
      socket.off("appointment_updated", handleAppointmentUpdated);
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all appointments
      const apps = await appointmentService.getAppointments();
      setAppointments(apps);

      // Fetch doctors list
      const docs = await doctorService.getDoctors();
      setDoctorsCount(docs.length);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateAppointment(id, { status });
      // The socket event will trigger the update, but let's update local state just in case
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  // Metrics calculators
  const pendingApps = appointments.filter((app) => app.status === "pending");
  const approvedApps = appointments.filter((app) => app.status === "approved");
  const completedApps = appointments.filter((app) => app.status === "completed");
  const cancelledApps = appointments.filter((app) => app.status === "cancelled");

  // Extract unique patients from appointments to represent clinic users
  const uniquePatientsMap = new Map();
  appointments.forEach((app) => {
    if (app.patientId && app.patientName) {
      uniquePatientsMap.set(app.patientId, {
        id: app.patientId,
        name: app.patientName,
        latestDate: app.appointmentDate,
      });
    }
  });
  const patientsList = Array.from(uniquePatientsMap.values());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200/50 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-teal-600 animate-pulse" /> Admin Portal
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Live clinic operations, booking approvals, and patient consultations.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold">Synchronizing clinic data...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-teal-500/20 transition-all">
                <div className="p-4 bg-teal-50 text-teal-600 rounded-xl shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Doctors</span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{doctorsCount}</h3>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-teal-500/20 transition-all">
                <div className="p-4 bg-teal-50 text-teal-600 rounded-xl shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Patients</span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{patientsList.length}</h3>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-teal-500/20 transition-all">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Pending Approvals</span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{pendingApps.length}</h3>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-teal-500/20 transition-all">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Active Checkups</span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">
                    {approvedApps.length + completedApps.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Dashboard Sections: Operations & Chat */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side: Operations Queue (Col span 2) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                    <ClipboardList className="w-5 h-5 text-teal-600" /> Pending Approval Queue
                  </h2>

                  {pendingApps.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-teal-500 opacity-30" />
                      <p className="text-xs">No pending appointment requests to process.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-2">
                      {pendingApps.map((app) => (
                        <div key={app._id} className="py-4 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">{app.patientName}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Booking with <span className="font-semibold text-slate-600">{app.doctorName}</span> on {app.appointmentDate}
                            </p>
                            {app.notes && (
                              <p className="text-[10px] text-slate-400 mt-1 bg-slate-50 p-2 rounded-lg italic">
                                Notes: "{app.notes}"
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(app._id, "approved")}
                              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app._id, "cancelled")}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Approved & Recent Appointments Table */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                    <CalendarDays className="w-5 h-5 text-teal-600" /> Active Operations Logs
                  </h2>

                  {appointments.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-xs">No bookings recorded yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                            <th className="pb-3">Patient</th>
                            <th className="pb-3">Doctor</th>
                            <th className="pb-3">Schedule</th>
                            <th className="pb-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {appointments.map((app) => (
                            <tr key={app._id} className="hover:bg-slate-50/50">
                              <td className="py-3 font-semibold text-slate-800">{app.patientName}</td>
                              <td className="py-3 text-slate-600">{app.doctorName}</td>
                              <td className="py-3 text-slate-500">{app.appointmentDate}</td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${
                                    app.status === "approved"
                                      ? "bg-teal-50 border-teal-200 text-teal-700"
                                      : app.status === "cancelled"
                                      ? "bg-rose-50 border-rose-200 text-rose-700"
                                      : "bg-amber-50 border-amber-200 text-amber-700"
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Chat Console Widget (Col span 1) */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 h-fit">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <MessageSquare className="w-5 h-5 text-teal-600" /> Patient Support Center
                </h2>

                {patientsList.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                    <p className="text-[11px]">No active patient channels connected.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patientsList.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => setActiveChat({ id: patient.id, name: patient.name })}
                        className="w-full text-left p-3.5 border border-slate-150/70 hover:border-teal-500 rounded-xl flex items-center justify-between gap-3 hover:bg-teal-50/10 transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs">{patient.name}</h4>
                          <span className="text-[9px] text-slate-400 mt-0.5 block">
                            Recent visit: {patient.latestDate}
                          </span>
                        </div>
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-lg shrink-0">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Chat Support drawer */}
      {activeChat && (
        <ChatWindow
          receiverId={activeChat.id}
          receiverName={activeChat.name}
          onClose={() => setActiveChat(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;