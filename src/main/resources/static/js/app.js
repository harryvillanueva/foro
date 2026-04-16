// js/app.js

// Constante global para no repetir la URL del backend en cada archivo

export const API_BASE_URL = '/api'; // Más limpio y seguro

/**
 * Función genérica para mostrar mensajes de éxito o error en la UI.
 * @param {HTMLElement} elementoContenedor - El div donde se mostrará el mensaje
 * @param {string} mensaje - El texto a mostrar
 * @param {boolean} esError - Define el color (rojo para error, verde para éxito)
 */
export function mostrarAlerta(elementoContenedor, mensaje, esError = false) {
    elementoContenedor.textContent = mensaje;

    // Usamos clases de Tailwind dinámicamente
    const clasesBase = 'mt-4 p-3 rounded text-white text-center font-semibold transition-all duration-300';
    const colorClass = esError ? 'bg-red-500' : 'bg-green-500';

    elementoContenedor.className = `${clasesBase} ${colorClass}`;

    // Ocultar la alerta después de 4 segundos
    setTimeout(() => {
        elementoContenedor.classList.add('hidden');
    }, 4000);
}