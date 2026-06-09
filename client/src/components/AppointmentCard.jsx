import { Calendar, Stethoscope, MessageSquare, AlertTriangle, FileText, Ban } from "lucide-react";

function AppointmentCard({ appointment, onCancel, onChatInit }) {
  // Styles for different statuses
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "completed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const isCancelable = appointment.status === "pending" || appointment.status === "approved";

  return (
    <div className="glass-card rounded-2xl p-6 bg-white border border-slate-100/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
      {/* Appointment Info */}
      <div className="flex-1 space-y-3">
        {/* Doctor & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{appointment.doctorName}</h3>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold capitalize mt-1 ${getStatusStyle(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
          </div>
        </div>

        {/* Date & Details */}
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">Date:</span> {appointment.appointmentDate}
          </div>
        </div>

        {/* Doctor/Patient Notes */}
        {appointment.notes && (
          <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 max-w-2xl">
            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div className="text-[10px] text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-700 block mb-0.5">Symptom Note:</span>
              "{appointment.notes}"
            </div>
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="flex flex-wrap md:flex-col gap-2 shrink-0 md:items-end justify-start">
        {/* Chat Button */}
        <button
          onClick={onChatInit}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/10 text-slate-700 hover:text-teal-700 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Consult Support
        </button>

        {/* Cancel Button */}
        {isCancelable && (
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2 border border-transparent bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
          >
            <Ban className="w-3.5 h-3.5" /> Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;