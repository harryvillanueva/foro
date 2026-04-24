import { API_BASE_URL, initGlobalFeatures, swalCustom, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalFeatures();
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    let payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));

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
                div.className = "p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm transition-colors";
                const textoLimite = sala.limitePreguntasSemana > 0 ? `${sala.limitePreguntasSemana} pregs/sem` : 'Sin límite';

                div.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div><p class="font-bold text-gray-800 dark:text-white">${sala.nombre}</p><p class="text-[10px] uppercase font-bold text-orange-500 dark:text-orange-400">Límite: ${textoLimite}</p></div>
                        <button data-id="${sala.id}" class="btn-limite text-orange-600 dark:text-orange-400 hover:text-orange-800"><i class="fas fa-cog"></i></button>
                    </div>
                    <button data-id="${sala.id}" data-nombre="${sala.nombre}" class="btn-ver-pendientes w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-orange-500 py-1.5 rounded text-sm font-bold transition-all text-gray-700 dark:text-gray-200">Ver Pendientes</button>
                `;
                listaMisSalas.appendChild(div);
            });

            document.querySelectorAll('.btn-ver-pendientes').forEach(btn => btn.addEventListener('click', (e) => {
                cargarPendientes(e.currentTarget.dataset.id, e.currentTarget.dataset.nombre);
                cargarParticipantes(e.currentTarget.dataset.id);
            }));

            document.querySelectorAll('.btn-limite').forEach(btn => btn.addEventListener('click', async (e) => {
                // SOLUCIÓN: Guardar el ID
                const salaId = e.currentTarget.dataset.id;

                const { value: num } = await swalCustom().fire({
                    title: 'Límite de Preguntas',
                    input: 'number',
                    inputLabel: 'Preguntas permitidas por semana (0 = sin límite):',
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar'
                });
                if(num !== undefined && num !== null && num !== "") {
                    await fetch(`${API_BASE_URL}/moderacion/avanzada/limite?salaId=${salaId}&limite=${num}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
                    mostrarAlerta(null, "Límite actualizado.", false);
                    cargarSalasModerador();
                }
            }));
        } catch (error) { console.error(error); }
    };

    const cargarPendientes = async (salaId, nombreSala) => {
        tituloModeracion.textContent = `Moderando: ${nombreSala}`;
        const resp = await fetch(`${API_BASE_URL}/moderacion/sala/${salaId}/pendientes`, { headers: { 'Authorization': `Bearer ${token}` }});
        const pendientes = await resp.json();

        if(pendientes.length === 0) {
            contenedorPendientes.innerHTML = `<div class="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded border border-green-200 dark:border-green-800"><i class="fas fa-check-circle mr-2"></i>Todo limpio.</div>`;
        } else {
            contenedorPendientes.innerHTML = '';
            pendientes.forEach(p => {
                const card = document.createElement('div');
                card.className = "bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border-l-4 border-orange-400 mb-4 transition-colors";
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-2"><span class="text-sm font-bold text-gray-700 dark:text-gray-200"><i class="fas fa-user mr-1"></i> ${p.autorNombre}</span><span class="text-xs text-gray-400 dark:text-gray-500">${new Date(p.fechaCreacion).toLocaleString()}</span></div>
                    <p class="text-gray-800 dark:text-gray-200 mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded">${p.contenido}</p>
                    <div class="flex gap-2 flex-wrap mb-3">
                        <button data-id="${p.id}" data-estado="APROBADA" class="btn-procesar bg-green-600 text-white px-3 py-1 rounded text-sm font-bold"><i class="fas fa-check"></i> Aprobar</button>
                        <button data-id="${p.id}" data-estado="RECHAZADA" class="btn-procesar bg-red-500 text-white px-3 py-1 rounded text-sm font-bold"><i class="fas fa-times"></i> Rechazar</button>
                        <button data-autor="${p.autorId}" class="btn-avisar bg-gray-800 dark:bg-gray-600 text-white px-3 py-1 rounded text-sm font-bold ml-auto"><i class="fas fa-envelope"></i> Avisar</button>
                    </div>
                    <div class="flex gap-2 flex-wrap pt-3 border-t dark:border-gray-700">
                        <button data-autor="${p.autorId}" data-sala="${salaId}" data-dias="30" class="btn-bloquear text-orange-600 dark:text-orange-400 hover:underline text-xs font-bold"><i class="fas fa-ban"></i> Bloqueo (30d)</button>
                        <button data-autor="${p.autorId}" data-sala="${salaId}" data-dias="0" class="btn-bloquear text-red-700 dark:text-red-400 hover:underline text-xs font-bold"><i class="fas fa-skull"></i> Expulsar Sala</button>
                        <button data-autor="${p.autorId}" class="btn-baja text-purple-700 dark:text-purple-400 hover:underline text-xs font-bold"><i class="fas fa-gavel"></i> Pedir Baja Global</button>
                    </div>
                `;
                contenedorPendientes.appendChild(card);
            });
        }
        asignarEventosGenerales(salaId, nombreSala);
    };

    const cargarParticipantes = async (salaId) => {
        tituloParticipantes.classList.remove('hidden');
        const resp = await fetch(`${API_BASE_URL}/moderacion/avanzada/sala/${salaId}/participantes`, { headers: { 'Authorization': `Bearer ${token}` }});
        const usuarios = await resp.json();
        contenedorParticipantes.innerHTML = '';

        usuarios.forEach(u => {
            const card = document.createElement('div');
            card.className = "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between";
            card.innerHTML = `
                <div class="mb-3"><p class="font-bold text-gray-800 dark:text-white"><i class="fas fa-user text-blue-500 mr-2"></i>${u.nombre}</p><p class="text-xs text-gray-500">${u.email}</p></div>
                <div class="flex flex-wrap gap-2 mt-2 pt-2 border-t dark:border-gray-700">
                    <button data-autor="${u.id}" class="btn-avisar flex-1 bg-gray-800 dark:bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold"><i class="fas fa-envelope"></i> Avisar</button>
                    <button data-autor="${u.id}" data-sala="${salaId}" data-dias="30" class="btn-bloquear flex-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded text-xs font-bold">Bloqueo</button>
                </div>
            `;
            contenedorParticipantes.appendChild(card);
        });
        asignarEventosGenerales(salaId, "");
    };

    const asignarEventosGenerales = (salaId, nombreSala) => {
        // PROCESAR ESTADO
        document.querySelectorAll('.btn-procesar').forEach(b => b.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            const estado = e.currentTarget.dataset.estado;
            await fetch(`${API_BASE_URL}/moderacion/publicacion/${id}/estado?nuevoEstado=${estado}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
            cargarPendientes(salaId, nombreSala);
        }));

        // ENVIAR AVISO A USUARIO
        document.querySelectorAll('.btn-avisar').forEach(b => b.addEventListener('click', async (e) => {
            const autorId = e.currentTarget.dataset.autor; // SOLUCIÓN: Extraer antes del await

            const { value: msg } = await swalCustom().fire({
                title: 'Aviso Privado',
                input: 'textarea',
                inputPlaceholder: 'Escribe el motivo del aviso...',
                showCancelButton: true,
                confirmButtonText: 'Enviar'
            });
            if(msg && msg.trim() !== "") {
                const resp = await fetch(`${API_BASE_URL}/moderacion/avisar-usuario?destinoId=${autorId}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'text/plain' }, body: msg});
                if (resp.ok) mostrarAlerta(null, "Aviso enviado al perfil del usuario.", false);
            }
        }));

        // BLOQUEAR USUARIO
        document.querySelectorAll('.btn-bloquear').forEach(b => b.addEventListener('click', async (e) => {
            const autor = e.currentTarget.dataset.autor;  // SOLUCIÓN: Extraer antes del await
            const sala = e.currentTarget.dataset.sala;
            const dias = e.currentTarget.dataset.dias;

            const { isConfirmed } = await swalCustom().fire({
                title: '¿Bloquear usuario?',
                text: `¿Seguro de expulsar a este usuario ${dias == 0 ? 'permanentemente' : dias+' días'}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, bloquear',
                customClass: { confirmButton: 'bg-red-600 text-white px-4 py-2 rounded mx-2' }
            });
            if(isConfirmed) {
                await fetch(`${API_BASE_URL}/moderacion/avanzada/bloquear?usuarioId=${autor}&salaId=${sala}&dias=${dias}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
                mostrarAlerta(null, "Usuario bloqueado.", false);
            }
        }));

        // PEDIR BAJA GLOBAL
        document.querySelectorAll('.btn-baja').forEach(b => b.addEventListener('click', async (e) => {
            const autorId = e.currentTarget.dataset.autor; // SOLUCIÓN: Extraer antes del await

            const { isConfirmed } = await swalCustom().fire({
                title: '¿Solicitar Baja Global?',
                text: '¿Pedir al Superadmin que expulse del sistema a este usuario?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, solicitar baja'
            });
            if(isConfirmed) {
                await fetch(`${API_BASE_URL}/moderacion/avanzada/solicitar-baja?usuarioId=${autorId}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
                mostrarAlerta(null, "Petición enviada al Superadmin.", false);
            }
        }));
    };

    cargarSalasModerador();
});