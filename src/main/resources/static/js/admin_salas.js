import { API_BASE_URL, mostrarAlerta, initGlobalFeatures, swalCustom } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalFeatures();
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    const cargarSalas = async () => {
        const respSalas = await fetch(`${API_BASE_URL}/salas`, { headers: { 'Authorization': `Bearer ${token}` } });
        const salas = await respSalas.json();
        const tablaSalas = document.getElementById('listaSalas');

        tablaSalas.innerHTML = '';
        salas.forEach(sala => {
            tablaSalas.innerHTML += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="p-3 border dark:border-gray-600 font-medium">${sala.nombre}</td>
                    <td class="p-3 border dark:border-gray-600">${sala.tematica}</td>
                    <td class="p-3 border dark:border-gray-600 text-center">${sala.requiereModeracion ? '✅' : '❌'}</td>
                    <td class="p-3 border dark:border-gray-600 text-center">
                        <button data-id="${sala.id}" class="btn-eliminar bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded font-bold"><i class="fas fa-trash-alt"></i> Borrar</button>
                    </td>
                </tr>`;
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => btn.addEventListener('click', async (e) => {
            const salaId = e.currentTarget.dataset.id;

            const result = await swalCustom().fire({
                title: '¿Eliminar sala definitivamente?',
                text: "Esta acción borrará todas sus preguntas y no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, borrar',
                cancelButtonText: 'Cancelar',
                customClass: { confirmButton: 'bg-red-600 text-white px-4 py-2 rounded mx-2 hover:bg-red-700', cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded mx-2 hover:bg-gray-600' }
            });

            if(result.isConfirmed) {
                const resp = await fetch(`${API_BASE_URL}/salas/admin/eliminar/${salaId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if(resp.ok) { mostrarAlerta(null, "La sala ha sido destruida.", false); cargarSalas(); }
                else { mostrarAlerta(null, await resp.text(), true); }
            }
        }));
    };

    document.getElementById('formCrearSala').addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = { nombre: document.getElementById('nombreSala').value, tematica: document.getElementById('tematicaSala').value, requiereModeracion: document.getElementById('modSala').checked };
        const resp = await fetch(`${API_BASE_URL}/salas/admin/crear`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(datos) });
        if (resp.ok) { document.getElementById('formCrearSala').reset(); cargarSalas(); mostrarAlerta(null, "Sala creada con éxito", false); }
        else { mostrarAlerta(null, await resp.text(), true); }
    });

    cargarSalas();
});