/**
 * auth.js - El Cerebro de Seguridad del Frontend
 * Ubicación: js/utils/auth.js
 * Función: Manejar tokens, roles, login y protección de rutas.
 */

// 1. CONFIGURACIÓN: La dirección de tu Backend (Java Spring Boot)
// Asegúrate de que tu backend esté corriendo en el puerto 8080.
const API_URL = "http://localhost:8080/api";

// 2. GUARDAR EL TOKEN (Se llama al hacer Login exitoso)
function guardarToken(token) {
    localStorage.setItem('jwt_token', token);
}

// 3. OBTENER EL TOKEN (Para enviarlo en las cabeceras de las peticiones)
function obtenerToken() {
    return localStorage.getItem('jwt_token');
}

// 4. VERIFICAR SI ESTÁ LOGUEADO (Devuelve true/false)
function estaLogueado() {
    return !!obtenerToken();
}

// 5. CERRAR SESIÓN (Logout)
// Borra el token y te manda a la pantalla de inicio
function cerrarSesion() {
    localStorage.removeItem('jwt_token');
    
    
    // Al poner solo 'index.html', el navegador lo buscará en la misma carpeta
    // donde ya estás (o sea, dentro de 'pages').
    window.location.href = 'index.html'; 
}

// 6. DECIFRAR EL ROL (Leer el token JWT oculto)
// Esto evita tener que instalar librerías pesadas como jwt-decode
function obtenerRolUsuario() {
    const token = obtenerToken();
    if (!token) return null;

    try {
        // El token tiene 3 partes separadas por puntos. La segunda es el "Payload".
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Decodificamos de Base64 a texto legible
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const datos = JSON.parse(jsonPayload);
        
        // Buscamos el rol. En tu Backend lo guardaste en el mapa como "rol"
        return datos.rol || datos.roles || datos.authorities; 
    } catch (error) {
        console.error("Error leyendo el token:", error);
        return null;
    }
}

// 7. EL SEMÁFORO (Redirigir automáticamente según quién eres)
// Se usa después del Login para saber a dónde mandar al usuario.
function redirigirSegunRol() {
    const rol = obtenerRolUsuario();
    console.log("Rol detectado:", rol);

    if (!rol) {
        alert("Error: No se encontró un rol válido en el sistema.");
        return;
    }

    // MAPA DE RUTAS (Asegúrate de crear estas páginas en la carpeta 'pages')
    if (rol === 'ROLE_ADMIN') {
        window.location.href = 'dashboard.html'; // El Admin suele estar en la raíz
    } else if (rol === 'ROLE_ADMIN_BIBLIOTECA') {
        window.location.href = 'pages/biblioteca.html'; // Módulo Juan
    } else if (rol === 'ROLE_ADMIN_BAR') {
        window.location.href = 'pages/bar.html'; // Módulo María
    } else if (rol === 'ROLE_ESTUDIANTE') {
        window.location.href = 'pages/perfil.html'; // Módulo Estudiante
    } else {
        // Si el rol es desconocido, lo mandamos al perfil por seguridad
        window.location.href = 'pages/perfil.html';
    }
}

// 8. PROTECCIÓN DE RUTAS (El Guardia de Seguridad)
// Pon esta función al inicio de cualquier HTML que quieras proteger.
function protegerRuta() {
    const token = obtenerToken();
    if (!token) {
        // Si no hay token, no tiene permiso de estar aquí.
        alert("Acceso denegado. Tu sesión ha expirado o no has iniciado sesión.");
        window.location.href = '/index.html';
    }
    // Opcional: Podrías validar aquí si el token ya expiró por fecha
}