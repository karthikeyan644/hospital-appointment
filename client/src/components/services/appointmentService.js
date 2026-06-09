import api from "../utils/api";

const appointmentService = {
  bookAppointment: async (
    appointmentData
  ) => {
    const response = await api.post(
      "/appointments",
      appointmentData
    );

    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get(
      "/appointments"
    );

    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(
      `/appointments/${id}`
    );

    return response.data;
  },

  updateAppointment: async (
    id,
    appointmentData
  ) => {
    const response = await api.put(
      `/appointments/${id}`,
      appointmentData
    );

    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.delete(
      `/appointments/${id}`
    );

    return response.data;
  },
};

export default appointmentService;