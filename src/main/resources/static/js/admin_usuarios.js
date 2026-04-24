import { API_BASE_URL, initGlobalFeatures } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalFeatures();
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    const cargarUsuarios = async () => {
        const resp = await fetch(`${API_BASE_URL}/admin/usuarios`, { headers: { 'Authorization': `Bearer ${token}` } });
        const usuarios = await resp.json();
        const tabla = document.getElementById('tablaUsuarios');
        tabla.innerHTML = '';

        usuarios.forEach(u => {
            const tr = document.createElement('tr');
            tr.className = "border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors";
            tr.innerHTML = `
                <td class="p-4 font-medium dark:text-white">${u.nombre}</td>
                <td class="p-4 text-gray-600 dark:text-gray-400">${u.email}</td>
                <td class="p-4"><span class="px-2 py-1 rounded text-[10px] font-bold ${u.rol === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'}">${u.rol}</span></td>
                <td class="p-4 text-center">
                    ${u.activo
                        ? '<span class="text-green-600 dark:text-green-400 font-bold"><i class="fas fa-check-circle"></i> Activo</span>'
                        : '<span class="text-red-600 dark:text-red-400 font-bold"><i class="fas fa-ban"></i> BANEADO</span>'}
                </td>
                <td class="p-4 text-center">
                    <button data-id="${u.id}" class="btn-toggle px-4 py-1 rounded font-bold text-sm transition ${u.activo ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-600 hover:text-white' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-600 hover:text-white'}">
                        ${u.activo ? 'Banear Usuario' : 'Restaurar Cuenta'}
                    </button>
                </td>
            `;
            tabla.appendChild(tr);
        });

        document.querySelectorAll('.btn-toggle').forEach(btn => btn.addEventListener('click', async (e) => {
            await fetch(`${API_BASE_URL}/admin/usuarios/${e.currentTarget.dataset.id}/toggle-activo`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
            cargarUsuarios();
        }));
    };
    cargarUsuarios();
});