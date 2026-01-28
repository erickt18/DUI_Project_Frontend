// dashboard.js - Admin Bar
console.log("🚀 Dashboard.js cargado correctamente");

// Configuración
const API_URL = "http://localhost:8080/api";
const token = localStorage.getItem('jwt_token');

// Verificar sesión
if (!token) {
    alert("Sesión expirada. Por favor inicia sesión.");
    window.location.href = '../index.html';
}

// ========== CAMBIAR VISTA ==========
window.cambiarVista = function(vistaNombre, elementoMenu) {
    console.log("Cambiando a:", vistaNombre);
    
    // Ocultar todas
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
    });
    
    // Mostrar seleccionada
    const vista = document.getElementById('view-' + vistaNombre);
    if (vista) {
        vista.classList.add('active');
    } else {
        console.error("Vista no encontrada:", 'view-' + vistaNombre);
    }
    
    // Actualizar menú
    document.querySelectorAll('.menu-item').forEach(el => {
        el.classList.remove('active');
    });
    if (elementoMenu) {
        elementoMenu.classList.add('active');
    }
    
    // Cargar datos si es dashboard
    if (vistaNombre === 'dashboard') {
        cargarDashboard();
    }
}

// ========== CARGAR DASHBOARD ==========
window.cargarDashboard = async function() {
    console.log("📊 Cargando dashboard...");
    
    // Mostrar datos por defecto mientras carga
    document.getElementById('stat-productos').innerText = '24';
    document.getElementById('stat-ventas').innerText = '$12,450';
    document.getElementById('stat-clientes').innerText = '156';
    document.getElementById('stat-transacciones').innerText = '89';
    
    // Mostrar tabla de actividad demo
    const tbody = document.getElementById('tabla-actividad');
    tbody.innerHTML = `
        <tr>
            <td>27/01/2026 14:30</td>
            <td><span class="badge bg-success">COMPRA_BAR</span></td>
            <td>estudiante@ude.edu.ec</td>
            <td style="font-weight: bold; color: #27ae60">$5.50</td>
        </tr>
        <tr>
            <td>27/01/2026 13:15</td>
            <td><span class="badge bg-warning">RECARGA</span></td>
            <td>maria.gomez@ude.edu.ec</td>
            <td style="font-weight: bold; color: #27ae60">$20.00</td>
        </tr>
        <tr>
            <td>27/01/2026 12:00</td>
            <td><span class="badge bg-success">COMPRA_BAR</span></td>
            <td>carlos.ruiz@ude.edu.ec</td>
            <td style="font-weight: bold; color: #27ae60">$8.75</td>
        </tr>
        <tr>
            <td>27/01/2026 11:45</td>
            <td><span class="badge bg-warning">RECARGA</span></td>
            <td>ana.lopez@ude.edu.ec</td>
            <td style="font-weight: bold; color: #27ae60">$15.00</td>
        </tr>
        <tr>
            <td>27/01/2026 10:30</td>
            <td><span class="badge bg-success">COMPRA_BAR</span></td>
            <td>pedro.martinez@ude.edu.ec</td>
            <td style="font-weight: bold; color: #27ae60">$3.25</td>
        </tr>
    `;
    
    // Intentar obtener datos reales del backend (opcional)
    try {
        const res = await fetch(`${API_URL}/dashboard/info`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (res.ok) {
            const stats = await res.json();
            console.log("✅ Stats del backend:", stats);
            
            document.getElementById('stat-productos').innerText = stats.totalProductos || '24';
            document.getElementById('stat-ventas').innerText = '$' + (stats.totalSaldo || 12450).toFixed(2);
            document.getElementById('stat-clientes').innerText = stats.totalEstudiantes || '156';
            document.getElementById('stat-transacciones').innerText = stats.totalTransacciones || '89';
        } else {
            console.log("⚠️ Backend no disponible, mostrando datos demo");
        }
    } catch (error) {
        console.log("⚠️ Error conectando al backend:", error.message);
        console.log("✅ Mostrando datos de demostración");
    }
}

// ========== LOGOUT ==========
window.logout = function() {
    if (confirm("¿Cerrar sesión?")) {
        localStorage.removeItem('jwt_token');
        window.location.href = '../index.html';
    }
}

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM cargado, inicializando dashboard...");
    cargarDashboard();
});

// Cargar también inmediatamente por si el DOM ya está listo
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("✅ DOM ya estaba listo, cargando dashboard...");
    setTimeout(cargarDashboard, 100);
}
