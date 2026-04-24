export const API_BASE_URL = '/api';

export function mostrarAlerta(elementoContenedor, mensaje, esError = false) {
    elementoContenedor.textContent = mensaje;
    elementoContenedor.className = `mt-4 p-3 rounded text-white text-center font-semibold transition-all duration-300 block ${esError ? 'bg-red-500' : 'bg-green-500'}`;
    elementoContenedor.classList.remove('hidden');
    setTimeout(() => { elementoContenedor.classList.add('hidden'); }, 4000);
}

// ==========================================
// MÓDULO BILINGÜE (i18n)
// ==========================================
export const diccionario = {
    es: {
        "nav.inicio": "Inicio", "nav.salas": "Gestión Salas", "nav.mods": "Moderadores",
        "nav.usuarios": "Usuarios", "nav.modPanel": "Moderación", "nav.perfil": "Mi Perfil", "nav.salir": "Salir",
        "btn.entrar": "Entrar a la Sala", "btn.publicar": "Publicar Pregunta", "btn.responder": "Publicar Respuesta",
        "btn.volver": "Volver", "btn.suscribir": "Suscribirme", "btn.desuscribir": "Anular Suscripción"
    },
    en: {
        "nav.inicio": "Home", "nav.salas": "Manage Rooms", "nav.mods": "Moderators",
        "nav.usuarios": "Users", "nav.modPanel": "Moderation", "nav.perfil": "My Profile", "nav.salir": "Logout",
        "btn.entrar": "Enter Room", "btn.publicar": "Post Question", "btn.responder": "Post Answer",
        "btn.volver": "Go Back", "btn.suscribir": "Subscribe", "btn.desuscribir": "Unsubscribe"
    }
};

export function cambiarIdioma(lang) {
    localStorage.setItem('foro_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (diccionario[lang] && diccionario[lang][key]) {
            const icono = el.querySelector('i');
            el.textContent = ' ' + diccionario[lang][key];
            if(icono) el.prepend(icono);
        }
    });
}

export function obtenerIdiomaActual() { return localStorage.getItem('foro_lang') || 'es'; }

// ==========================================
// MÓDULO MODO OSCURO (Dark Mode)
// ==========================================
export function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('foro_theme', isDark ? 'dark' : 'light');
    actualizarIconoTema(isDark);
}

function actualizarIconoTema(isDark) {
    const btnTheme = document.getElementById('btn-tema');
    if (btnTheme) btnTheme.innerHTML = isDark ? '<i class="fas fa-sun text-yellow-300"></i>' : '<i class="fas fa-moon text-gray-200"></i>';
}

// ==========================================
// NAVBAR Y RUTAS (Global)
// ==========================================
function configurarNavbar() {
    const token = localStorage.getItem('jwt_foro');
    if (!token) return;
    try {
        const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) userDisplay.textContent = `${payload.sub} (${payload.rol})`;

        if (payload.rol === 'SUPERADMIN') {
            document.getElementById('link-admin-salas')?.classList.remove('hidden');
            document.getElementById('link-admin-mods')?.classList.remove('hidden');
            document.getElementById('link-admin-users')?.classList.remove('hidden');
        }
        if (payload.rol === 'SUPERADMIN' || payload.rol === 'MODERADOR') {
            document.getElementById('link-moderacion')?.classList.remove('hidden');
        }
    } catch (e) { console.error(e); }

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        localStorage.removeItem('jwt_foro');
        window.location.href = 'login.html';
    });
}

export function initGlobalFeatures() {
    const theme = localStorage.getItem('foro_theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        actualizarIconoTema(true);
    } else { actualizarIconoTema(false); }

    cambiarIdioma(obtenerIdiomaActual());
    configurarNavbar();

    document.getElementById('btn-tema')?.addEventListener('click', toggleDarkMode);
    document.getElementById('btn-lang-es')?.addEventListener('click', () => cambiarIdioma('es'));
    document.getElementById('btn-lang-en')?.addEventListener('click', () => cambiarIdioma('en'));
}