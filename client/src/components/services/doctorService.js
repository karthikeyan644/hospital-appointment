import api from "../utils/api";

const doctorService = {
  getDoctors: async () => {
    const response = await api.get(
      "/doctors"
    );

    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(
      `/doctors/${id}`
    );

    return response.data;
  },

  addDoctor: async (doctorData) => {
    const response = await api.post(
      "/doctors",
      doctorData
    );

    return response.data;
  },

  updateDoctor: async (
    id,
    doctorData
  ) => {
    const response = await api.put(
      `/doctors/${id}`,
      doctorData
    );

    return response.data;
  },

  deleteDoctor: async (id) => {
    const response = await api.delete(
      `/doctors/${id}`
    );

    return response.data;
  },
};

export default doctorService;