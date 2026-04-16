import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');

    // 1. Verificar si hay token, si no, redirigir al login
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Decodificar el JWT para saber el ROL y el Email
    // El payload es la segunda parte del token (separada por puntos)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    const userEmail = payload.sub;
    const userRol = payload.rol; // SUPERADMIN, MODERADOR, PARTICIPANTE

    // 3. Configurar la UI según el Rol
    document.getElementById('user-display').textContent = `${userEmail} (${userRol})`;

    if (userRol === 'SUPERADMIN') {
        document.getElementById('link-admin-salas').classList.remove('hidden');
        document.getElementById('link-admin-mods').classList.remove('hidden');
    } else if (userRol === 'MODERADOR') {
        // Podrías mostrar un link a "Mi Panel de Moderación" aquí después
    }

    // 4. Lógica de Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem('jwt_foro');
        window.location.href = 'login.html';
    });

    // 5. Cargar las salas visualmente en el Index
    const cargarSalasVisibles = async () => {
        const contenedor = document.getElementById('contenedor-salas');

        try {
            const resp = await fetch(`${API_BASE_URL}/salas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const salas = await resp.json();

            if (salas.length === 0) {
                contenedor.innerHTML = `<p class="col-span-full text-center text-gray-500">No hay salas creadas todavía.</p>`;
                return;
            }

            contenedor.innerHTML = ''; // Limpiar loader
            salas.forEach(sala => {
                const card = document.createElement('div');
                card.className = "bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer";
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <span class="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg uppercase">${sala.tematica}</span>
                        ${sala.requiereModeracion ? '<i class="fas fa-shield-halved text-orange-400" title="Sala Moderada"></i>' : ''}
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${sala.nombre}</h3>
                    <p class="text-gray-600 text-sm mb-4">Entra para participar y resolver tus dudas sobre ${sala.tematica}.</p>
                    <button class="w-full bg-gray-50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold py-2 rounded-lg border border-blue-100 transition-colors">
                        Entrar a la Sala
                    </button>
                `;
                contenedor.appendChild(card);
            });
        } catch (error) {
            contenedor.innerHTML = `<p class="col-span-full text-center text-red-500">Error al cargar las salas.</p>`;
        }
    };

    cargarSalasVisibles();
});