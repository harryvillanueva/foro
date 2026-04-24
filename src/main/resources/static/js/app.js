export const API_BASE_URL = '/api';

// ==========================================
// SWEETALERT2: Configuración dinámica (Dark Mode & Tailwind)
// ==========================================
export function swalCustom() {
    const isDark = document.documentElement.classList.contains('dark');
    return Swal.mixin({
        background: isDark ? '#1f2937' : '#ffffff', // Gris oscuro o blanco
        color: isDark ? '#ffffff' : '#111827',
        customClass: {
            confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 mx-2 transition-colors',
            cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-600 mx-2 transition-colors',
            input: 'border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-4'
        },
        buttonsStyling: false // Obliga a usar las clases de Tailwind
    });
}

// Ahora mostrarAlerta usa SweetAlert en toda la web
export function mostrarAlerta(elementoContenedor, mensaje, esError = false) {
    swalCustom().fire({
        icon: esError ? 'error' : 'success',
        title: esError ? '¡Oops!' : '¡Éxito!',
        text: mensaje,
        timer: 3000,
        showConfirmButton: false
    });
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