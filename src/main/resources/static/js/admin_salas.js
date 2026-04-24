import { API_BASE_URL, mostrarAlerta, initGlobalFeatures } from './app.js';

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
            if(confirm("¿Eliminar sala definitivamente?")) {
                await fetch(`${API_BASE_URL}/salas/admin/eliminar/${e.currentTarget.dataset.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                cargarSalas();
            }
        }));
    };

    document.getElementById('formCrearSala').addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = { nombre: document.getElementById('nombreSala').value, tematica: document.getElementById('tematicaSala').value, requiereModeracion: document.getElementById('modSala').checked };
        const resp = await fetch(`${API_BASE_URL}/salas/admin/crear`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(datos) });
        if (resp.ok) { document.getElementById('formCrearSala').reset(); cargarSalas(); }
        else { alert(await resp.text()); }
    });

    cargarSalas();
});