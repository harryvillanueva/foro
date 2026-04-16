import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener y validar el token
    const token = localStorage.getItem('jwt_foro');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Decodificar el Token de forma segura
    let userRol = '';
    let userEmail = '';

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        userEmail = payload.sub;
        userRol = payload.rol;
    } catch (error) {
        console.error("Error al leer el token:", error);
        localStorage.removeItem('jwt_foro');
        window.location.href = 'login.html';
        return;
    }

    // 3. Modificar la interfaz según el ROL (Usamos '?.' por seguridad)
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.textContent = `${userEmail} (${userRol})`;
    }

    if (userRol === 'SUPERADMIN') {
        document.getElementById('link-admin-salas')?.classList.remove('hidden');
        document.getElementById('link-admin-mods')?.classList.remove('hidden');
    }

    // Tanto el SUPERADMIN como el MODERADOR pueden ver el panel de moderación
    if (userRol === 'SUPERADMIN' || userRol === 'MODERADOR') {
        document.getElementById('link-moderacion')?.classList.remove('hidden');
    }

    // 4. Lógica de Cerrar Sesión
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        localStorage.removeItem('jwt_foro');
        window.location.href = 'login.html';
    });

    // 5. Cargar las Salas visualmente
    const cargarSalasVisibles = async () => {
        const contenedor = document.getElementById('contenedor-salas');

        try {
            const resp = await fetch(`${API_BASE_URL}/salas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const salas = await resp.json();

            if (salas.length === 0) {
                contenedor.innerHTML = `<p class="col-span-full text-center text-gray-500 font-medium">No hay salas creadas todavía.</p>`;
                return;
            }

            contenedor.innerHTML = '';
            salas.forEach(sala => {
                const card = document.createElement('div');
                card.className = "bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow";

                // Usamos data-id en el botón para saber a qué sala entrar
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <span class="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg uppercase">${sala.tematica}</span>
                        ${sala.requiereModeracion ? '<i class="fas fa-shield-halved text-orange-400" title="Sala Moderada"></i>' : ''}
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${sala.nombre}</h3>
                    <p class="text-gray-600 text-sm mb-4">Entra para participar y resolver tus dudas sobre ${sala.tematica}.</p>
                    <button data-id="${sala.id}" class="btn-entrar w-full bg-gray-50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold py-2 rounded-lg border border-blue-100 transition-colors">
                        Entrar a la Sala
                    </button>
                `;
                contenedor.appendChild(card);
            });

            // 6. Asignar el evento a todos los botones generados
            const botonesEntrar = document.querySelectorAll('.btn-entrar');
            botonesEntrar.forEach(boton => {
                boton.addEventListener('click', (evento) => {
                    const idSala = evento.currentTarget.dataset.id;
                    window.location.href = `sala.html?id=${idSala}`;
                });
            });

        } catch (error) {
            console.error("Error en Fetch:", error);
            contenedor.innerHTML = `<p class="col-span-full text-center text-red-500 font-bold border border-red-200 bg-red-50 p-4 rounded-lg">Error al comunicarse con el servidor.</p>`;
        }
    };

    cargarSalasVisibles();
});