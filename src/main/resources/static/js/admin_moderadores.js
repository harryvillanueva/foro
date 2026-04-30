import { API_BASE_URL, mostrarAlerta, initGlobalFeatures, swalCustom } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalFeatures();
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    const formCrearMod = document.getElementById('formCrearModerador');
    const formAsignarMod = document.getElementById('formAsignarModerador');
    const selectModerador = document.getElementById('selectModerador');
    const selectSala = document.getElementById('selectSala');
    const tablaModeradores = document.getElementById('listaModeradoresTabla');
    const tablaSalasModeradas = document.getElementById('listaSalasModeradas');
    let moderadoresGlobal = [];

    const cargarDatos = async () => {
        try {
            const respMods = await fetch(`${API_BASE_URL}/admin/moderadores`, { headers: { 'Authorization': `Bearer ${token}` }});
            moderadoresGlobal = await respMods.json();

            selectModerador.innerHTML = '<option value="">Elige un moderador...</option>';
            tablaModeradores.innerHTML = '';
            moderadoresGlobal.forEach(mod => {
                tablaModeradores.innerHTML += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><td class="p-3 border dark:border-gray-600 text-gray-500 font-bold">#${mod.id}</td><td class="p-3 border dark:border-gray-600 dark:text-gray-200">${mod.nombre}</td><td class="p-3 border dark:border-gray-600 dark:text-gray-200">${mod.email}</td></tr>`;
                selectModerador.innerHTML += `<option value="${mod.id}">${mod.nombre} (${mod.email})</option>`;
            });

            const respSalas = await fetch(`${API_BASE_URL}/salas`, { headers: { 'Authorization': `Bearer ${token}` }});
            const salas = await respSalas.json();

            selectSala.innerHTML = '<option value="">Elige una sala...</option>';
            salas.forEach(sala => selectSala.innerHTML += `<option value="${sala.id}">${sala.nombre} (${sala.moderadorId ? 'Ocupada' : 'Libre'})</option>`);

            const salasOcupadas = salas.filter(s => s.moderadorId != null);
            tablaSalasModeradas.innerHTML = '';

            if(salasOcupadas.length === 0) tablaSalasModeradas.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-500">No hay salas con moderadores asignados.</td></tr>';
            else {
                salasOcupadas.forEach(sala => {
                    const mod = moderadoresGlobal.find(m => m.id === sala.moderadorId);
                    tablaSalasModeradas.innerHTML += `
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td class="p-3 border dark:border-gray-600 font-medium dark:text-gray-200">${sala.nombre}</td>
                            <td class="p-3 border dark:border-gray-600 text-blue-600 dark:text-blue-400 font-bold">${mod ? mod.nombre : 'ID Desconocido'}</td>
                            <td class="p-3 border dark:border-gray-600 text-center"><button data-id="${sala.id}" class="btn-quitar bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white px-4 py-1 rounded font-bold"><i class="fas fa-user-minus"></i> Quitar</button></td>
                        </tr>
                    `;
                });

                document.querySelectorAll('.btn-quitar').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const salaId = e.currentTarget.dataset.id;

                        const { isConfirmed } = await swalCustom().fire({
                            title: '¿Remover al moderador?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, remover',
                            cancelButtonText: 'Cancelar',
                            customClass: { confirmButton: 'bg-red-600 text-white px-4 py-2 rounded mx-2 hover:bg-red-700', cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded mx-2' }
                        });

                        if(isConfirmed) {
                            const resp = await fetch(`${API_BASE_URL}/salas/admin/remover-moderador/${salaId}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }});
                            if(resp.ok) { mostrarAlerta(null, "Moderador removido", false); cargarDatos(); }
                            else { mostrarAlerta(null, "Error al quitar", true); }
                        }
                    });
                });
            }
        } catch (error) { console.error(error); }
    };

    formCrearMod.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = { nombre: document.getElementById('nombreMod').value, email: document.getElementById('emailMod').value, password: document.getElementById('passwordMod').value };
        const resp = await fetch(`${API_BASE_URL}/admin/moderadores/registro`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(datos) });
        if (resp.ok) { mostrarAlerta(null, "Moderador creado con éxito", false); formCrearMod.reset(); cargarDatos(); }
        else { mostrarAlerta(null, await resp.text(), true); }
    });

    formAsignarMod.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = { moderadorId: selectModerador.value, salaId: selectSala.value };
        const resp = await fetch(`${API_BASE_URL}/salas/admin/asignar-moderador`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(datos) });
        if (resp.ok) { mostrarAlerta(null, "Asignación exitosa", false); cargarDatos(); }
        else { mostrarAlerta(null, await resp.text(), true); }
    });

    cargarDatos();
});