/**
 * auth.js - El Cerebro de Seguridad del Frontend
 * Aquí manejamos el Token, los Roles y la Protección de páginas.
 */

// 1. CONFIGURACIÓN: La dirección de tu Backend (Java)
const API_URL = "http://localhost:8080/api";

// 2. GUARDAR EL TOKEN (Cuando haces Login)
function guardarToken(token) {
    localStorage.setItem('jwt_token', token);
}

// 3. OBTENER EL TOKEN (Para usarlo en las peticiones)
function obtenerToken() {
    return localStorage.getItem('jwt_token');
}

// 4. CERRAR SESIÓN (Logout)
function cerrarSesion() {
    localStorage.removeItem('jwt_token');
    window.location.href = '/index.html'; // Te devuelve al Login
}

// 5. DECIFRAR EL ROL (Leer el token oculto)
function obtenerRolUsuario() {
    const token = obtenerToken();
    if (!token) return null;

    try {
        // El token tiene 3 partes. La segunda tiene la info (payload).
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const datos = JSON.parse(jsonPayload);
        
        // OJO: Aquí asumimos que en Java guardaste el rol con la clave "rol" o "roles"
        // Si no funciona, revisaremos cómo se llama en tu token.
        return datos.rol || datos.roles || datos.authorities; 
    } catch (error) {
        console.error("Error leyendo el token:", error);
        return null;
    }
}

// 6. EL SEMÁFORO (Redirigir según quién eres)
function redirigirSegunRol() {
    const rol = obtenerRolUsuario();
    console.log("Rol detectado:", rol);

    if (!rol) {
        alert("Error: No se encontró un rol válido.");
        return;
    }

    // LÓGICA DE DIRECCIONAMIENTO
    if (rol === 'ROLE_ADMIN') {
        window.location.href = 'dashboard.html'; // El Jefe
    } else if (rol === 'ROLE_ADMIN_BIBLIOTECA') {
        window.location.href = 'pages/biblioteca.html'; // Juan
    } else if (rol === 'ROLE_ADMIN_BAR') {
        window.location.href = 'pages/bar.html'; // María
    } else if (rol === 'ROLE_ESTUDIANTE') {
        window.location.href = 'pages/perfil.html'; // Los Alumnos
    } else {
        // Por defecto, si no sabemos qué es
        window.location.href = 'pages/perfil.html';
    }
}

// 7. PROTECCIÓN (Poner esto al inicio de páginas privadas)
function protegerRuta() {
    const token = obtenerToken();
    if (!token) {
        alert("Acceso denegado. Debes iniciar sesión.");
        window.location.href = '/index.html';
    }
}