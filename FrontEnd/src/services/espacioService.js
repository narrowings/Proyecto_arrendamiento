// src/services/espacioService.js
import axios from "axios";
import { getToken } from "../utils/jwt";

const API_URL = "http://127.0.0.1:8080/space/espacios";

const crearEspacio = async (data) => {
  const token = getToken();
  const response = await axios.post(
    `${API_URL}/registrar`,
    data,
    {
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default { crearEspacio };

