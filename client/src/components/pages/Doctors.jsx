import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import DoctorCard from "../DoctorCard";
import doctorService from "../services/doctorService";
import { Search, Stethoscope, Sparkles } from "lucide-react";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Specialties categories list
  const specialties = ["All", "Cardiology", "Neurology", "Pediatrics", "Dermatology", "Orthopedics"];

  // Filter logic
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialization.toLowerCase() === selectedSpecialty.toLowerCase();
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Banner/Header */}
        <div className="text-center md:text-left md:flex justify-between items-end border-b border-slate-200/50 pb-8 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Stethoscope className="w-8 h-8 text-teal-600" /> Consult Top Specialists
            </h1>
            <p className="text-slate-500 mt-2 text-xs">
              Book certified medical doctors based on fees, specialty, or availability.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mt-4 md:mt-0 max-w-md w-full shrink-0">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search doctor name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border border-slate-200 rounded-xl py-2.5 text-xs placeholder-slate-400 focus:outline-none focus:border-teal-500 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Categories / Specialties Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold select-none cursor-pointer transition-all ${
                selectedSpecialty === spec
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-600/10"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold">Loading doctor catalog...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-2xl p-10 max-w-lg mx-auto">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm">No Doctors Found</h3>
            <p className="text-slate-400 mt-2 text-xs">
              We couldn't find any medical specialists matching "{searchQuery}" or specialty filter.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Doctors;
