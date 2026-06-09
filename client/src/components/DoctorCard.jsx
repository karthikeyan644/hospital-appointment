import { Link } from "react-router-dom";
import { User, Award, Star, Clock, CalendarRange } from "lucide-react";

function DoctorCard({ doctor }) {
  // Generate random rating/reviews for premium aesthetic
  const rating = 4.8;
  const reviewsCount = 20 + Math.floor(Math.random() * 80);

  return (
    <div className="glass-card rounded-2xl p-6 bg-white flex flex-col h-full border border-slate-100/50">
      {/* Profile info block */}
      <div className="flex gap-4 items-start pb-5 border-b border-slate-100">
        {/* Mock avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-teal-500/10">
          <User className="w-6 h-6" />
        </div>
        
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold tracking-wide uppercase">
            {doctor.specialization}
          </span>
          <h3 className="font-bold text-slate-800 text-sm mt-1">{doctor.name}</h3>
          
          <div className="flex items-center gap-1.5 mt-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-700">{rating}</span>
            <span className="text-[10px] text-slate-400 font-medium">({reviewsCount} Reviews)</span>
          </div>
        </div>
      </div>

      {/* Specialty lists */}
      <div className="py-4 space-y-2.5 flex-grow text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Award className="w-3.5 h-3.5 text-teal-600" /> Experience
          </span>
          <span className="font-semibold text-slate-700">{doctor.experience} Years</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-teal-600" /> Availability
          </span>
          <span className="font-semibold text-slate-700 text-[10px] truncate max-w-[150px]">
            {doctor.availability?.join(", ") || "Mon - Fri"}
          </span>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <p className="text-[11px] text-slate-400 leading-relaxed mt-3 italic line-clamp-2">
            "{doctor.bio}"
          </p>
        )}
      </div>

      {/* Card CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium">Consultation Fee</span>
          <span className="font-bold text-teal-600 text-sm">₹{doctor.fee}</span>
        </div>

        <Link
          to={`/book/${doctor._id}`}
          className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
        >
          <CalendarRange className="w-3.5 h-3.5" /> Book Appointment
        </Link>
      </div>
    </div>
  );
}

export default DoctorCard;