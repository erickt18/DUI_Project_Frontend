/**
 * api.js - El Mensajero
 * Se encarga de hablar con Java pegando siempre el Token de seguridad.
 */

const BASE_URL = "http://localhost:8080/api";

// Función genérica para hacer peticiones (GET, POST, PUT, DELETE)
async function peticionAutenticada(endpoint, metodo = 'GET', cuerpo = null) {
    
    // 1. Buscamos el token que guardó auth.js
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        alert(" No tienes sesión iniciada. Volviendo al login...");
        window.location.href = '/index.html';
        return;
    }

    // 2. Preparamos las opciones de envío
    const opciones = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    };

    // Si hay datos para enviar (ej. crear libro), los agregamos
    if (cuerpo) {
        opciones.body = JSON.stringify(cuerpo);
    }

    try {
        // 3. Hacemos el viaje al Backend
        const respuesta = await fetch(`${BASE_URL}${endpoint}`, opciones);
        
        // Si el token venció o es falso (Error 403/401)
        if (respuesta.status === 401 || respuesta.status === 403) {
            alert(" Tu sesión expiró o no tienes permiso.");
            localStorage.removeItem('jwt_token'); // Borramos el token malo
            window.location.href = '/index.html';
            return null;
        }

        // Si es un error 404 o 500, lanzamos error
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.message || "Error en el servidor");
        }

        // Si todo sale bien, devolvemos los datos limpios
        return await respuesta.json(); 

    } catch (error) {
        console.error("Error de conexión:", error);
        alert(" Error: " + error.message);
        return null;
    }
}