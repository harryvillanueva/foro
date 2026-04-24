import { API_BASE_URL, mostrarAlerta, initGlobalFeatures } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el Menú, Idioma y Dark Mode
    initGlobalFeatures();

    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    const formCrearMod = document.getElementById('formCrearModerador');
    const formAsignarMod = document.getElementById('formAsignarModerador');
    const alertaMod = document.getElementById('alertaMod');
    const alertaAsignacion = document.getElementById('alertaAsignacion');

    const selectModerador = document.getElementById('selectModerador');
    const selectSala = document.getElementById('selectSala');
    const tablaModeradores = document.getElementById('listaModeradoresTabla');
    const tablaSalasModeradas = document.getElementById('listaSalasModeradas');

    let moderadoresGlobal = [];

    const cargarDatos = async () => {
        try {
            // 1. Cargar Mods
            const respMods = await fetch(`${API_BASE_URL}/admin/moderadores`, { headers: { 'Authorization': `Bearer ${token}` }});
            moderadoresGlobal = await respMods.json();

            selectModerador.innerHTML = '<option value="">Elige un moderador...</option>';
            tablaModeradores.innerHTML = '';
            moderadoresGlobal.forEach(mod => {
                tablaModeradores.innerHTML += `
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="p-3 border dark:border-gray-600 text-gray-500 dark:text-gray-400 font-bold">#${mod.id}</td>
                        <td class="p-3 border dark:border-gray-600 dark:text-gray-200">${mod.nombre}</td>
                        <td class="p-3 border dark:border-gray-600 dark:text-gray-200">${mod.email}</td>
                    </tr>`;
                selectModerador.innerHTML += `<option value="${mod.id}">${mod.nombre} (${mod.email})</option>`;
            });

            // 2. Cargar Salas
            const respSalas = await fetch(`${API_BASE_URL}/salas`, { headers: { 'Authorization': `Bearer ${token}` }});
            const salas = await respSalas.json();

            selectSala.innerHTML = '<option value="">Elige una sala...</option>';
            salas.forEach(sala => {
                selectSala.innerHTML += `<option value="${sala.id}">${sala.nombre} (${sala.moderadorId ? 'Ocupada' : 'Libre'})</option>`;
            });

            // 3. Llenar tabla de "Quitar Moderador"
            const salasOcupadas = salas.filter(s => s.moderadorId != null);
            tablaSalasModeradas.innerHTML = '';

            if(salasOcupadas.length === 0) {
                tablaSalasModeradas.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-500 dark:text-gray-400">No hay salas con moderadores asignados.</td></tr>';
            } else {
                salasOcupadas.forEach(sala => {
                    const mod = moderadoresGlobal.find(m => m.id === sala.moderadorId);
                    const modNombre = mod ? mod.nombre : `ID Desconocido: ${sala.moderadorId}`;

                    tablaSalasModeradas.innerHTML += `
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td class="p-3 border dark:border-gray-600 font-medium dark:text-gray-200">${sala.nombre}</td>
                            <td class="p-3 border dark:border-gray-600 text-blue-600 dark:text-blue-400 font-bold">${modNombre}</td>
                            <td class="p-3 border dark:border-gray-600 text-center">
                                <button data-id="${sala.id}" class="btn-quitar bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white px-4 py-1 rounded font-bold transition-colors">
                                    <i class="fas fa-user-minus"></i> Quitar
                                </button>
                            </td>
                        </tr>
                    `;
                });

                document.querySelectorAll('.btn-quitar').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        if(confirm('¿Seguro que deseas remover al moderador de esta sala?')) {
                            const resp = await fetch(`${API_BASE_URL}/salas/admin/remover-moderador/${e.currentTarget.dataset.id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
                            if(resp.ok) cargarDatos();
                            else alert("Error al quitar moderador.");
                        }
                    });
                });
            }
        } catch (error) { console.error("Error", error); }
    };

    formCrearMod.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = { nombre: document.getElementById('nombreMod').value, email: document.getElementById('emailMod').value, password: document.getElementById('passwordMod').value };
        const resp = await fetch(`${API_BASE_URL}/admin/moderadores/registro`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(datos) });
        if (resp.ok) { mostrarAlerta(alertaMod, "Moderador creado", false); formCrearMod.reset(); cargarDatos(); }
        else { const err = await resp.text(); mostrarAlerta(alertaMod, err, true); }
    });

    formAsignarMod.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = { moderadorId: selectModerador.value, salaId: selectSala.value };
        const resp = await fetch(`${API_BASE_URL}/salas/admin/asignar-moderador`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(datos) });
        if (resp.ok) { mostrarAlerta(alertaAsignacion, "¡Asignación exitosa!", false); cargarDatos(); }
        else { const err = await resp.text(); mostrarAlerta(alertaAsignacion, err, true); }
    });

    cargarDatos();
});