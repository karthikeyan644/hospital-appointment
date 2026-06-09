import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import appointmentService from "../services/appointmentService";
import doctorService from "../services/doctorService";
import { Calendar, User, FileText, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctorById(doctorId);
      setDoctor(data);
    } catch (error) {
      console.error("Failed to load doctor profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentDate) {
      alert("Please select a date.");
      return;
    }

    setBooking(true);
    try {
      await appointmentService.bookAppointment({
        doctorId,
        appointmentDate,
        notes,
      });

      alert("Appointment Booked Successfully!");
      navigate("/appointments");
    } catch (error) {
      alert("Booking Failed. Try again.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Back Link */}
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-600 text-xs font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            <p className="text-xs font-semibold">Retrieving doctor availability...</p>
          </div>
        ) : !doctor ? (
          <div className="text-center p-10 bg-white border rounded-2xl">
            <p className="text-slate-500 text-sm">Doctor profile not found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left side: Doctor Quick Profile Card */}
            <div className="md:col-span-2 glass-card rounded-2xl p-6 bg-white border border-slate-100 flex flex-col items-center text-center shadow-sm h-fit">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg mb-4">
                <User className="w-10 h-10" />
              </div>
              <span className="px-3 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider">
                {doctor.specialization}
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-2">{doctor.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{doctor.experience} Years of Practice</p>
              
              <div className="border-t border-slate-100 w-full mt-5 pt-4 space-y-2.5 text-xs text-slate-600 text-left">
                <p className="leading-relaxed text-slate-500 text-[11px] italic">
                  "{doctor.bio}"
                </p>
                <div className="flex justify-between font-semibold border-t border-slate-50 pt-3 text-slate-700">
                  <span>Consultation Fee:</span>
                  <span className="text-teal-600">₹{doctor.fee}</span>
                </div>
              </div>
            </div>

            {/* Right side: Booking form */}
            <div className="md:col-span-3 glass-card rounded-2xl p-8 bg-white border border-slate-100 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-6">
                Schedule Checkup
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600" /> Select Appointment Date
                  </label>
                  <input
                    type="date"
                    required
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="block w-full border border-slate-200 rounded-xl py-3 px-4 text-xs placeholder-slate-400 focus:outline-none focus:border-teal-500 bg-slate-50/50"
                  />
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    Available Days: {doctor.availability?.join(", ")}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-600" /> Symptoms / Reasons (Optional)
                  </label>
                  <textarea
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe any symptoms or reasons for your visit..."
                    className="block w-full border border-slate-200 rounded-xl py-3 px-4 text-xs placeholder-slate-400 focus:outline-none focus:border-teal-500 bg-slate-50/50 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={booking}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md shadow-teal-500/10"
                  >
                    {booking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Confirm Appointment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default BookAppointment;