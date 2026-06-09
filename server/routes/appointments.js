import express from "express";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Book an appointment
router.post("/", auth, async (req, res) => {
  try {
    const { doctorId, appointmentDate, notes } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = new Appointment({
      patientId: req.user.id,
      patientName: req.user.name,
      doctorId,
      doctorName: doctor.name,
      appointmentDate,
      notes: notes || "",
    });

    await appointment.save();

    // Emit real-time event to admin/doctor
    if (req.io) {
      req.io.emit("new_appointment", appointment);
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all appointments (Patients see their own, Admin sees all)
router.get("/", auth, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "admin") {
      appointments = await Appointment.find().sort({ createdAt: -1 });
    } else {
      appointments = await Appointment.find({ patientId: req.user.id }).sort({
        createdAt: -1,
      });
    }
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointment by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Access control: Admin or the booking patient
    if (req.user.role !== "admin" && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update appointment (e.g. approve/reject/complete)
router.put("/:id", auth, async (req, res) => {
  try {
    const { status, appointmentDate, notes } = req.body;

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Patients can only cancel their own, Admins can do anything
    if (req.user.role !== "admin" && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Apply updates
    if (status) appointment.status = status;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    // Emit real-time socket notification
    if (req.io) {
      req.io.emit("appointment_updated", appointment);
      // Emit a specific notification event for the user
      req.io.emit(`notification_${appointment.patientId}`, {
        type: "status_change",
        title: "Appointment Status Updated",
        message: `Your appointment with Dr. ${appointment.doctorName} is now ${appointment.status}.`,
        appointmentId: appointment._id,
      });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel appointment (Delete or set status to cancelled)
router.delete("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (req.user.role !== "admin" && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Emit real-time event
    if (req.io) {
      req.io.emit("appointment_updated", appointment);
      req.io.emit(`notification_${appointment.patientId}`, {
        type: "cancellation",
        title: "Appointment Cancelled",
        message: `Appointment with Dr. ${appointment.doctorName} on ${appointment.appointmentDate} has been cancelled.`,
        appointmentId: appointment._id,
      });
    }

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
