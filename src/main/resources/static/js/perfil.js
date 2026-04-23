import { API_BASE_URL } from './app.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    // 1. Cargar Notificaciones
    const cargarNotificaciones = async () => {
        const resp = await fetch(`${API_BASE_URL}/perfil/notificaciones`, { headers: { 'Authorization': `Bearer ${token}` } });
        const notis = await resp.json();
        const contenedor = document.getElementById('listaNotificaciones');
        contenedor.innerHTML = notis.length === 0 ? '<p class="text-gray-400">No tienes avisos nuevos.</p>' : '';

        notis.forEach(n => {
            const div = document.createElement('div');
            div.className = "bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-400";
            div.innerHTML = `
                <p class="text-xs font-bold text-gray-500 uppercase">Aviso de: ${n.autorNombre}</p>
                <p class="text-sm text-gray-700 mt-1">${n.mensaje}</p>
                <p class="text-[10px] text-gray-400 mt-2">${new Date(n.fecha).toLocaleString()}</p>
            `;
            contenedor.appendChild(div);
        });
    };

    // 2. Cargar Historial
    const cargarHistorial = async () => {
        const resp = await fetch(`${API_BASE_URL}/perfil/historial`, { headers: { 'Authorization': `Bearer ${token}` } });
        const posts = await resp.json();
        const contenedor = document.getElementById('listaHistorial');
        contenedor.innerHTML = '';

        posts.forEach(p => {
            const div = document.createElement('div');
            div.className = "bg-white p-4 rounded-lg shadow-sm border border-gray-100";
            div.innerHTML = `
                <div class="flex justify-between text-xs mb-2">
                    <span class="font-bold ${p.tipo === 'PREGUNTA' ? 'text-blue-600' : 'text-green-600'}">${p.tipo}</span>
                    <span class="text-gray-400">${new Date(p.fechaCreacion).toLocaleString()}</span>
                </div>
                <p class="text-gray-700">${p.contenido}</p>
                <p class="text-[10px] mt-2 font-bold uppercase ${p.estado === 'APROBADA' ? 'text-green-500' : 'text-orange-500'}">Estado: ${p.estado}</p>
            `;
            contenedor.appendChild(div);
        });
    };

    cargarNotificaciones();
    cargarHistorial();
});