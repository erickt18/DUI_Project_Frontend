/**
 * api.js - El Mensajero Central
 */

// Configuración de la API (Tu Backend Java)
const API_URL = "http://localhost:8080/api";

// Función para obtener los permisos (Token)
function getHeaders() {
  const token = localStorage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// 3. Tu función avanzada (La guardamos para usos futuros más complejos)
async function peticionAutenticada(endpoint, metodo = "GET", cuerpo = null) {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    window.location.href = "../index.html";
    return null;
  }

  const opciones = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (cuerpo) opciones.body = JSON.stringify(cuerpo);

  try {
    const respuesta = await fetch(`${API_URL}${endpoint}`, opciones);

    if (respuesta.status === 401 || respuesta.status === 403) {
      alert("Tu sesión expiró.");
      localStorage.removeItem("jwt_token");
      window.location.href = "../index.html";
      return null;
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error API:", error);
    return null;
  }
}
