import { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { Bell, Trash2, Calendar, CheckCircle, XCircle } from "lucide-react";

function NotificationCenter() {
  const { user, socket } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen to Socket events
  useEffect(() => {
    if (!socket || !user) return;

    // Listen for personal status notifications
    const handlePersonalNotification = (notification) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: notification.title,
          message: notification.message,
          type: notification.type,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false,
        },
        ...prev,
      ]);
    };

    // Listen for general admin alerts (if admin)
    const handleNewAppointmentAdmin = (appointment) => {
      if (user.role === "admin") {
        setNotifications((prev) => [
          {
            id: Date.now(),
            title: "New Appointment Booked",
            message: `${appointment.patientName} booked with Dr. ${appointment.doctorName} on ${appointment.appointmentDate}.`,
            type: "booking",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
          },
          ...prev,
        ]);
      }
    };

    socket.on(`notification_${user.id}`, handlePersonalNotification);
    socket.on("new_appointment", handleNewAppointmentAdmin);

    return () => {
      socket.off(`notification_${user.id}`, handlePersonalNotification);
      socket.off("new_appointment", handleNewAppointmentAdmin);
    };
  }, [socket, user]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "status_change":
        return <CheckCircle className="w-5 h-5 text-teal-500" />;
      case "cancellation":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Calendar className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          markAllRead();
        }}
        className="relative p-2.5 rounded-full hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 glass-card rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white flex justify-between items-center">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs flex items-center gap-1 hover:text-teal-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 flex gap-3 transition-colors ${
                    n.read ? "bg-white" : "bg-teal-50/30"
                  } hover:bg-slate-50`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-xs text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
