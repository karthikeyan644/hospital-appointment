import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hospital";

const seedData = async () => {
  try {
    console.log("[Seeder] Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("[Seeder] Connected successfully.");

    // Clean up existing data
    console.log("[Seeder] Cleaning existing collections...");
    await User.deleteMany({});
    await Doctor.deleteMany({});
    console.log("[Seeder] Cleanup completed.");

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const doctorPassword = await bcrypt.hash("doctor123", salt);
    const patientPassword = await bcrypt.hash("patient123", salt);

    // Create users
    console.log("[Seeder] Creating users...");
    const users = await User.create([
      {
        name: "System Admin",
        email: "admin@medflow.com",
        password: adminPassword,
        role: "admin",
      },
      {
        name: "Dr. Sarah Jenkins",
        email: "doctor@medflow.com",
        password: doctorPassword,
        role: "doctor",
      },
      {
        name: "John Doe",
        email: "patient@medflow.com",
        password: patientPassword,
        role: "patient",
      },
    ]);
    console.log(`[Seeder] Seeded ${users.length} users successfully.`);

    // Create doctors
    console.log("[Seeder] Creating doctors...");
    const doctors = await Doctor.create([
      {
        name: "Dr. Sarah Jenkins",
        specialization: "Cardiology",
        experience: 12,
        fee: 800,
        bio: "Specializing in cardiovascular health, heart disease prevention, and post-surgery rehabilitation.",
        availability: ["Monday", "Wednesday", "Friday"],
      },
      {
        name: "Dr. Alex Carter",
        specialization: "Neurology",
        experience: 8,
        fee: 650,
        bio: "Expertise in managing epilepsy, migraines, neuropathic pain, and sleep-related brain disorders.",
        availability: ["Tuesday", "Thursday"],
      },
      {
        name: "Dr. Elena Rostova",
        specialization: "Pediatrics",
        experience: 15,
        fee: 500,
        bio: "Dedicated to complete pediatric health management, developmental monitoring, and childhood immunizations.",
        availability: ["Monday", "Wednesday", "Thursday"],
      },
      {
        name: "Dr. Marcus Vance",
        specialization: "Dermatology",
        experience: 10,
        fee: 700,
        bio: "Specialist in cosmetic dermatology, eczema, acne treatment, and diagnostic skin biopsies.",
        availability: ["Tuesday", "Wednesday", "Friday"],
      },
      {
        name: "Dr. Lisa Wong",
        specialization: "Orthopedics",
        experience: 14,
        fee: 750,
        bio: "Surgical and non-surgical treatments for joint disorders, sports injuries, and spine rehabilitation.",
        availability: ["Monday", "Tuesday", "Thursday"],
      },
    ]);
    console.log(`[Seeder] Seeded ${doctors.length} doctors successfully.`);

    console.log("[Seeder] Seeding finished successfully.");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Seeding error:", error);
    process.exit(1);
  }
};

seedData();
