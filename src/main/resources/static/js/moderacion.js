import { API_BASE_URL } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    let payload;
    try { payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); }
    catch (e) { window.location.href = 'login.html'; return; }

    const listaMisSalas = document.getElementById('listaMisSalas');
    const contenedorPendientes = document.getElementById('contenedorPendientes');
    const tituloModeracion = document.getElementById('tituloModeracion');
    const tituloParticipantes = document.getElementById('tituloParticipantes');
    const contenedorParticipantes = document.getElementById('contenedorParticipantes');

    const cargarSalasModerador = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/salas`, { headers: { 'Authorization': `Bearer ${token}` }});
            const salas = await resp.json();
            const misSalas = (payload.rol === 'SUPERADMIN') ? salas : salas.filter(s => s.moderadorId != null);

            listaMisSalas.innerHTML = '';
            misSalas.forEach(sala => {
                const div = document.createElement('div');
                div.className = "p-3 rounded-lg bg-gray-50 border border-gray-200 shadow-sm";
                const textoLimite = sala.limitePreguntasSemana > 0 ? `${sala.limitePreguntasSemana} pregs/semana` : 'Sin límite';

                div.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <p class="font-bold text-gray-800">${sala.nombre}</p>
                            <p class="text-[10px] uppercase font-bold text-orange-500">Límite: ${textoLimite}</p>
                        </div>
                        <button data-id="${sala.id}" class="btn-limite text-orange-600 hover:text-orange-800"><i class="fas fa-cog"></i></button>
                    </div>
                    <button data-id="${sala.id}" data-nombre="${sala.nombre}" class="btn-ver-pendientes w-full bg-white border border-gray-300 hover:border-orange-500 py-1.5 rounded text-sm font-bold transition-all text-gray-700">Ver Pendientes y Usuarios</button>
                `;
                listaMisSalas.appendChild(div);
            });

            document.querySelectorAll('.btn-ver-pendientes').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    cargarPendientes(e.currentTarget.dataset.id, e.currentTarget.dataset.nombre);
                    cargarParticipantes(e.currentTarget.dataset.id);
                });
            });

            document.querySelectorAll('.btn-limite').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const num = prompt("Preguntas permitidas por semana (0 = sin límite):");
                    if(num !== null && !isNaN(num)) {
                        await fetch(`${API_BASE_URL}/moderacion/avanzada/limite?salaId=${e.currentTarget.dataset.id}&limite=${num}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
                        alert("Límite actualizado.");
                        cargarSalasModerador();
                    }
                });
            });

        } catch (error) { listaMisSalas.innerHTML = '<p class="text-red-500">Error al cargar tus salas.</p>'; }
    };

    const cargarPendientes = async (salaId, nombreSala) => {
        tituloModeracion.textContent = `Moderando: ${nombreSala}`;
        contenedorPendientes.innerHTML = '<p class="text-gray-500">Cargando pendientes...</p>';

        try {
            const resp = await fetch(`${API_BASE_URL}/moderacion/sala/${salaId}/pendientes`, { headers: { 'Authorization': `Bearer ${token}` }});
            const pendientes = await resp.json();

            if(pendientes.length === 0) {
                contenedorPendientes.innerHTML = `<div class="bg-green-50 text-green-700 p-4 rounded border border-green-200"><i class="fas fa-check-circle mr-2"></i>No hay mensajes pendientes.</div>`;
                return;
            }

            contenedorPendientes.innerHTML = '';
            pendientes.forEach(p => {
                const card = document.createElement('div');
                card.className = "bg-white p-5 rounded-lg shadow-sm border-l-4 border-orange-400 mb-4";
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-sm font-bold text-gray-700"><i class="fas fa-user text-gray-400 mr-1"></i> ${p.autorNombre}</span>
                        <span class="text-xs text-gray-400">${new Date(p.fechaCreacion).toLocaleString()}</span>
                    </div>
                    <p class="text-gray-800 mb-4 bg-gray-50 p-3 rounded">${p.contenido}</p>
                    <div class="flex gap-2 flex-wrap mb-3">
                        <button data-id="${p.id}" data-estado="APROBADA" class="btn-procesar bg-green-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-700"><i class="fas fa-check"></i> Aprobar</button>
                        <button data-id="${p.id}" data-estado="RECHAZADA" class="btn-procesar bg-red-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-600"><i class="fas fa-times"></i> Rechazar</button>
                    </div>
                `;
                contenedorPendientes.appendChild(card);
            });

            document.querySelectorAll('.btn-procesar').forEach(b => b.addEventListener('click', async (e) => {
                const { id, estado } = e.currentTarget.dataset;
                await fetch(`${API_BASE_URL}/moderacion/publicacion/${id}/estado?nuevoEstado=${estado}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
                cargarPendientes(salaId, nombreSala);
            }));

        } catch (e) { contenedorPendientes.innerHTML = '<p class="text-red-500">Error al cargar pendientes.</p>'; }
    };

    // NUEVA FUNCIÓN: CARGAR USUARIOS SUSCRITOS PARA BLOQUEO DIRECTO
    const cargarParticipantes = async (salaId) => {
        tituloParticipantes.classList.remove('hidden');
        contenedorParticipantes.innerHTML = '<p class="text-gray-500 text-sm col-span-2">Cargando usuarios...</p>';

        try {
            const resp = await fetch(`${API_BASE_URL}/moderacion/avanzada/sala/${salaId}/participantes`, { headers: { 'Authorization': `Bearer ${token}` }});
            const usuarios = await resp.json();

            contenedorParticipantes.innerHTML = '';
            if(usuarios.length === 0) {
                contenedorParticipantes.innerHTML = '<p class="text-gray-500 italic text-sm col-span-2">No hay usuarios suscritos a esta sala.</p>';
                return;
            }

            usuarios.forEach(u => {
                const card = document.createElement('div');
                card.className = "bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between";
                card.innerHTML = `
                    <div class="mb-3">
                        <p class="font-bold text-gray-800"><i class="fas fa-user text-blue-500 mr-2"></i>${u.nombre}</p>
                        <p class="text-xs text-gray-500">${u.email}</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-autor="${u.id}" data-sala="${salaId}" data-dias="30" class="btn-bloquear-directo flex-1 bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">Bloqueo (30d)</button>
                        <button data-autor="${u.id}" data-sala="${salaId}" data-dias="0" class="btn-bloquear-directo flex-1 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">Expulsar Fijo</button>
                    </div>
                `;
                contenedorParticipantes.appendChild(card);
            });

            document.querySelectorAll('.btn-bloquear-directo').forEach(b => b.addEventListener('click', async (e) => {
                const { autor, sala, dias } = e.currentTarget.dataset;
                if(confirm(`¿Estás seguro de expulsar a este usuario por ${dias == 0 ? 'siempre' : dias + ' días'}? Se le notificará automáticamente.`)) {
                    await fetch(`${API_BASE_URL}/moderacion/avanzada/bloquear?usuarioId=${autor}&salaId=${sala}&dias=${dias}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
                    alert("Usuario bloqueado y notificado exitosamente.");
                }
            }));

        } catch (e) { contenedorParticipantes.innerHTML = '<p class="text-red-500 text-sm">Error cargando usuarios.</p>'; }
    };

    cargarSalasModerador();
});