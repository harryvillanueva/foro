import { API_BASE_URL, initGlobalFeatures, diccionario, obtenerIdiomaActual } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalFeatures();

    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    document.getElementById('user-display').textContent = `${payload.sub} (${payload.rol})`;

    if (payload.rol === 'SUPERADMIN') {
        document.getElementById('link-admin-salas')?.classList.remove('hidden');
        document.getElementById('link-admin-mods')?.classList.remove('hidden');
        document.getElementById('link-admin-users')?.classList.remove('hidden');
    }
    if (payload.rol === 'SUPERADMIN' || payload.rol === 'MODERADOR') {
        document.getElementById('link-moderacion')?.classList.remove('hidden');
    }

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        localStorage.removeItem('jwt_foro');
        window.location.href = 'login.html';
    });

    const cargarSalasVisibles = async () => {
        try {
            const respSalas = await fetch(`${API_BASE_URL}/salas`, { headers: { 'Authorization': `Bearer ${token}` } });
            const salas = await respSalas.json();

            const respSubs = await fetch(`${API_BASE_URL}/suscripciones/mis-suscripciones`, { headers: { 'Authorization': `Bearer ${token}` } });
            const suscripciones = await respSubs.json();

            const favIds = suscripciones.filter(s => s.esFavorita).map(s => s.salaId);
            const subIds = suscripciones.map(s => s.salaId);

            const contenedorSalas = document.getElementById('contenedor-salas');
            const contenedorFavs = document.getElementById('contenedor-favoritos');
            const seccionFavs = document.getElementById('seccion-favoritos');

            contenedorSalas.innerHTML = '';
            contenedorFavs.innerHTML = '';

            const lang = obtenerIdiomaActual();
            const txtEntrar = diccionario[lang]["btn.entrar"];
            const txtSuscrito = diccionario[lang]["badge.suscrito"];

            salas.forEach(sala => {
                const card = document.createElement('div');
                card.className = "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all relative";

                const esFavorita = favIds.includes(sala.id);
                const esSuscrito = subIds.includes(sala.id);

                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <span class="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-lg uppercase">${sala.tematica}</span>
                        <div class="flex gap-2">
                            ${esFavorita ? '<i class="fas fa-star text-orange-400"></i>' : ''}
                            ${sala.requiereModeracion ? '<i class="fas fa-shield-halved text-orange-400"></i>' : ''}
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${sala.nombre}</h3>
                    <button data-id="${sala.id}" class="btn-entrar w-full bg-blue-50 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white text-blue-600 dark:text-blue-200 font-semibold py-2 rounded-lg transition-colors mt-4">
                        ${txtEntrar}
                    </button>
                    ${esSuscrito ? `<span class="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">${txtSuscrito}</span>` : ''}
                `;

                if (esFavorita) {
                    contenedorFavs.appendChild(card);
                    seccionFavs.classList.remove('hidden');
                } else {
                    contenedorSalas.appendChild(card);
                }
            });

            document.querySelectorAll('.btn-entrar').forEach(boton => {
                boton.addEventListener('click', (e) => { window.location.href = `sala.html?id=${e.currentTarget.dataset.id}`; });
            });

        } catch (error) { console.error(error); }
    };

    cargarSalasVisibles();

    document.getElementById('btn-lang-es')?.addEventListener('click', cargarSalasVisibles);
    document.getElementById('btn-lang-en')?.addEventListener('click', cargarSalasVisibles);
});