import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import AppointmentCard from "../AppointmentCard";
import appointmentService from "../services/appointmentService";
import ChatWindow from "../ChatWindow";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, Hourglass, CheckCircle2, History, AlertCircle } from "lucide-react";

function MyAppointments() {
  const { user, socket } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // active | history
  const [activeChat, setActiveChat] = useState(null); // { id, name }

  useEffect(() => {
    loadAppointments();
  }, []);

  // Set up real-time socket refresh
  useEffect(() => {
    if (!socket) return;

    const handleAppointmentUpdated = (updatedApp) => {
      // If this appointment belongs to this user, refresh or update state
      if (updatedApp.patientId === user.id) {
        setAppointments((prev) =>
          prev.map((app) => (app._id === updatedApp._id ? updatedApp : app))
        );
      }
    };

    socket.on("appointment_updated", handleAppointmentUpdated);

    return () => {
      socket.off("appointment_updated", handleAppointmentUpdated);
    };
  }, [socket, user]);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await appointmentService.cancelAppointment(id);
      loadAppointments(); // fallback reload, though socket will also trigger it
    } catch (error) {
      alert("Failed to cancel appointment.");
    }
  };

  // Grouping appointments
  const activeBookings = appointments.filter((app) => app.status === "pending" || app.status === "approved");
  const historyBookings = appointments.filter((app) => app.status === "completed" || app.status === "cancelled");

  const displayList = activeTab === "active" ? activeBookings : historyBookings;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="flex items-center gap-2.5 pb-6 border-b border-slate-200/50 mb-8">
          <CalendarDays className="w-8 h-8 text-teal-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Appointments</h1>
            <p className="text-slate-500 text-xs mt-1">
              Check booking updates, launch chats, or request checkup changes.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 pb-px mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-1.5 pb-3.5 text-xs font-semibold relative transition-colors ${
              activeTab === "active" ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Hourglass className="w-4 h-4" /> Active Bookings
            {activeTab === "active" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-1.5 pb-3.5 text-xs font-semibold relative transition-colors ${
              activeTab === "history" ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <History className="w-4 h-4" /> Treatment History
            {activeTab === "history" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Content List */}
        {displayList.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl p-8 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
            <h3 className="font-bold text-slate-700 text-xs capitalize">No {activeTab} Appointments</h3>
            <p className="text-slate-400 mt-1.5 text-[11px]">
              You don't have any bookings classified under the {activeTab} section.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayList.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={() => handleCancelAppointment(appointment._id)}
                onChatInit={() => setActiveChat({ id: "admin", name: "Hospital Support" })}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Chat window if triggered */}
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

export default MyAppointments;
