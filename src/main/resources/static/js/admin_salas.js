import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.rol !== 'SUPERADMIN') {
        alert("Acceso denegado. No eres Superadministrador.");
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('formCrearSala');
    const tablaSalas = document.getElementById('listaSalas');
    const contenedorAlerta = document.getElementById('mensajeAlerta');

    const cargarSalas = async () => {
        try {
            // A. Traemos todos los moderadores
            const respMods = await fetch(`${API_BASE_URL}/admin/moderadores`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const moderadores = await respMods.json();

            const mapaModeradores = {};
            moderadores.forEach(mod => {
                mapaModeradores[mod.id] = mod.nombre;
            });

            // B. Traemos todas las salas
            const respSalas = await fetch(`${API_BASE_URL}/salas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const salas = await respSalas.json();

            // C. Pintamos la tabla
            tablaSalas.innerHTML = '';
            salas.forEach(sala => {
                let moderadorBadge = `<span class="text-gray-400 italic">Sin asignar</span>`;
                if (sala.moderadorId && mapaModeradores[sala.moderadorId]) {
                    moderadorBadge = `<span class="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded"><i class="fas fa-user-shield mr-1"></i> ${mapaModeradores[sala.moderadorId]}</span>`;
                }

                tablaSalas.innerHTML += `
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="p-3 border font-medium">${sala.nombre}</td>
                        <td class="p-3 border">${sala.tematica}</td>
                        <td class="p-3 border text-center">${sala.requiereModeracion ? '✅' : '❌'}</td>
                        <td class="p-3 border">${moderadorBadge}</td>
                        <td class="p-3 border text-center">
                            <button data-id="${sala.id}" data-nombre="${sala.nombre}" class="btn-eliminar bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-3 py-1 rounded font-bold transition-colors shadow-sm" title="Eliminar sala y sus preguntas">
                                <i class="fas fa-trash-alt"></i> Borrar
                            </button>
                        </td>
                    </tr>`;
            });

            // D. Asignamos evento a los botones de borrar
            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    const nombre = e.currentTarget.dataset.nombre;

                    if(confirm(`⚠️ ¡ATENCIÓN! ¿Estás totalmente seguro de querer eliminar la sala "${nombre}"?\n\nEsta acción borrará PERMANENTEMENTE todas sus preguntas, respuestas, suscripciones y bloqueos. No se puede deshacer.`)) {
                        try {
                            const resp = await fetch(`${API_BASE_URL}/salas/admin/eliminar/${id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });

                            if (resp.ok) {
                                alert("✅ La sala ha sido destruida permanentemente.");
                                cargarSalas(); // Recargamos
                            } else {
                                alert("❌ Error: " + await resp.text());
                            }
                        } catch (err) {
                            alert("❌ Error de conexión al intentar borrar.");
                        }
                    }
                });
            });

        } catch (error) {
            console.error("Error al cargar los datos:", error);
            tablaSalas.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-red-500 font-bold">Error al cargar las salas.</td></tr>';
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const datos = {
            nombre: document.getElementById('nombreSala').value,
            tematica: document.getElementById('tematicaSala').value,
            requiereModeracion: document.getElementById('modSala').checked
        };

        try {
            const resp = await fetch(`${API_BASE_URL}/salas/admin/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            if (resp.ok) {
                mostrarAlerta(contenedorAlerta, "Sala creada con éxito", false);
                form.reset();
                cargarSalas();
            } else {
                const errorText = await resp.text();
                mostrarAlerta(contenedorAlerta, errorText, true);
            }
        } catch (error) {
            mostrarAlerta(contenedorAlerta, "Error de conexión", true);
        }
    });

    cargarSalas();
});