/**
 * auth.js - El Cerebro de Seguridad del Frontend
 * Ubicación: js/utils/auth.js
 * Función: Manejar tokens, roles, login y protección de rutas.
 */

// 1. CONFIGURACIÓN: La dirección de tu Backend
const API_URL = "http://localhost:8080/api";

// 2. GUARDAR EL TOKEN
function guardarToken(token) {
    localStorage.setItem('jwt_token', token);
}

// 3. OBTENER EL TOKEN
function obtenerToken() {
    return localStorage.getItem('jwt_token');
}

// 4. VERIFICAR SI ESTÁ LOGUEADO
function estaLogueado() {
    return !!obtenerToken();
}

// 5. CERRAR SESIÓN (Logout Inteligente)
function cerrarSesion() {
    localStorage.removeItem('jwt_token');
    
    // Detectamos si estamos dentro de la carpeta 'pages' para saber cómo volver
    if (window.location.pathname.includes('/pages/')) {
        window.location.href = '../index.html'; // Salir de la carpeta
    } else {
        window.location.href = 'index.html'; // Ya estamos en la raíz
    }
}

// 6. DESCIFRAR EL ROL (Leer el token JWT)
function obtenerRolUsuario() {
    const token = obtenerToken();
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const datos = JSON.parse(jsonPayload);
        return datos.rol || datos.roles || datos.authorities; 
    } catch (error) {
        console.error("Error leyendo el token:", error);
        return null;
    }
}

// 7. EL SEMÁFORO (Redirigir automáticamente según quién eres)
// Esta es la función que se arregló para apuntar a los archivos correctos.
// 7. EL SEMÁFORO (Redirigir automáticamente según quién eres)
function redirigirSegunRol() {
    const rol = obtenerRolUsuario(); 

    if (rol === 'ROLE_ADMIN') {
        window.location.href = 'dashboard.html';
    } 
    else if (rol === 'ROLE_ADMIN_BAR' || rol === 'ROLE_ADMINBAR') {
        // ✅ CORREGIDO: Detectar si ya estamos en /pages o no
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = 'dashboard-bar.html';
        } else {
            window.location.href = 'pages/dashboard-bar.html';
        }
    } 
    else if (rol === 'ROLE_ESTUDIANTE') {
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = 'dashboard-estudiante.html';
        } else {
            window.location.href = 'pages/dashboard-estudiante.html';
        }
    } 
    else if (rol === 'ROLE_ADMIN_BIBLIOTECA' || rol === 'ROLE_ADMINBIBLIOTECA') {
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = 'dashboard-biblioteca.html';
        } else {
            window.location.href = 'pages/dashboard-biblioteca.html';
        }
    }
    else {
        window.location.href = 'index.html';
    }
}

// 8. PROTECCIÓN DE RUTAS (El Guardia de Seguridad)
function protegerRuta() {
    const token = obtenerToken();
    if (!token) {
        alert("Acceso denegado. Por favor inicia sesión.");
        
        // Redirección inteligente al login
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    }
    console.log("✅ auth.js cargado");
}