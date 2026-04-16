import { API_BASE_URL } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

    const listaMisSalas = document.getElementById('listaMisSalas');
    const contenedorPendientes = document.getElementById('contenedorPendientes');
    const tituloModeracion = document.getElementById('tituloModeracion');

    // 1. Cargar Salas del Moderador
    const cargarSalasModerador = async () => {
        const resp = await fetch(`${API_BASE_URL}/salas`, { headers: { 'Authorization': `Bearer ${token}` }});
        const salas = await resp.json();

        // El Superadmin ve todas, el Moderador solo las suyas (lo filtramos en el front por ahora para ir rápido)
        // En una app real, el backend debería filtrar findByModeradorId
        const misSalas = (payload.rol === 'SUPERADMIN') ? salas : salas.filter(s => s.moderadorId != null);
        // Nota: En un paso siguiente afinaremos que el backend use el ID del moderador logueado.

        listaMisSalas.innerHTML = '';
        misSalas.forEach(sala => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-3 rounded bg-gray-50 hover:bg-orange-100 border-l-4 border-transparent hover:border-orange-500 transition-all";
            btn.innerHTML = `<p class="font-bold text-gray-800">${sala.nombre}</p><p class="text-xs text-gray-500">${sala.tematica}</p>`;
            btn.onclick = () => cargarPendientes(sala.id, sala.nombre);
            listaMisSalas.appendChild(btn);
        });
    };

    // 2. Cargar Publicaciones Pendientes de una sala
    window.cargarPendientes = async (salaId, nombreSala) => {
        tituloModeracion.textContent = `Moderando: ${nombreSala}`;
        contenedorPendientes.innerHTML = '<p class="text-gray-500">Cargando mensajes...</p>';

        const resp = await fetch(`${API_BASE_URL}/moderacion/sala/${salaId}/pendientes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const pendientes = await resp.json();

        contenedorPendientes.innerHTML = '';
        if(pendientes.length === 0) {
            contenedorPendientes.innerHTML = '<div class="bg-green-100 text-green-700 p-4 rounded">¡Felicidades! No hay mensajes pendientes en esta sala.</div>';
            return;
        }

        pendientes.forEach(p => {
            const card = document.createElement('div');
            card.className = "bg-white p-5 rounded-lg shadow border-l-4 border-orange-400";
            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="text-sm font-bold text-gray-700"><i class="fas fa-user"></i> ${p.autorNombre}</span>
                    <span class="text-xs text-gray-500">${new Date(p.fechaCreacion).toLocaleString()}</span>
                </div>
                <p class="text-gray-800 mb-4">${p.contenido}</p>
                <div class="flex gap-2">
                    <button onclick="procesar(${p.id}, 'APROBADA', ${salaId}, '${nombreSala}')" class="bg-green-600 text-white px-4 py-1 rounded text-sm font-bold hover:bg-green-700"><i class="fas fa-check"></i> Aprobar</button>
                    <button onclick="procesar(${p.id}, 'RECHAZADA', ${salaId}, '${nombreSala}')" class="bg-red-600 text-white px-4 py-1 rounded text-sm font-bold hover:bg-red-700"><i class="fas fa-times"></i> Rechazar</button>
                </div>
            `;
            contenedorPendientes.appendChild(card);
        });
    };

    // 3. Aprobar o Rechazar
    window.procesar = async (id, estado, salaId, nombreSala) => {
        const resp = await fetch(`${API_BASE_URL}/moderacion/publicacion/${id}/estado?nuevoEstado=${estado}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(resp.ok) {
            cargarPendientes(salaId, nombreSala); // Recargar la lista
        } else {
            alert("Error al procesar la moderación");
        }
    };

    cargarSalasModerador();
});