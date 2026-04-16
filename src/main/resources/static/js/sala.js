import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    // Obtenemos el ID de la sala desde la URL (ej: sala.html?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const salaId = urlParams.get('id');

    if(!salaId) { window.location.href = 'index.html'; return; }

    let salaRequiereModeracion = false;

    // Elementos DOM
    const tituloSala = document.getElementById('tituloSala');
    const infoSala = document.getElementById('infoSala');
    const formPregunta = document.getElementById('formPregunta');
    const listaPreguntas = document.getElementById('listaPreguntas');
    const mensajeAlerta = document.getElementById('mensajeAlerta');

    // 1. Cargar detalles de la sala
    const cargarDetallesSala = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/salas/${salaId}`, { headers: { 'Authorization': `Bearer ${token}` }});
            const sala = await resp.json();

            tituloSala.textContent = sala.nombre;
            salaRequiereModeracion = sala.requiereModeracion;

            infoSala.innerHTML = `Temática: <span class="text-blue-600">${sala.tematica}</span> | Moderación: ${salaRequiereModeracion ? '<span class="text-orange-500 font-bold">Activa</span>' : '<span class="text-green-500 font-bold">Desactivada</span>'}`;
        } catch (error) {
            tituloSala.textContent = "Error al cargar la sala";
        }
    };

    // 2. Cargar preguntas APROBADAS
    const cargarPreguntas = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones/sala/${salaId}/preguntas`, { headers: { 'Authorization': `Bearer ${token}` }});
            const preguntas = await resp.json();

            listaPreguntas.innerHTML = '';
            if(preguntas.length === 0) {
                listaPreguntas.innerHTML = '<p class="text-gray-500 italic">No hay preguntas en esta sala. ¡Sé el primero en participar!</p>';
                return;
            }

            preguntas.forEach(p => {
                // Formatear fecha simple
                const fecha = new Date(p.fechaCreacion).toLocaleString('es-ES');

                listaPreguntas.innerHTML += `
                    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="bg-blue-100 text-blue-800 w-8 h-8 flex items-center justify-center rounded-full font-bold">
                                ${p.autorNombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p class="font-bold text-gray-800 text-sm">${p.autorNombre}</p>
                                <p class="text-xs text-gray-500">${fecha}</p>
                            </div>
                        </div>
                        <p class="text-gray-700">${p.contenido}</p>
                        <button class="mt-4 text-sm text-blue-600 font-bold hover:underline"><i class="fas fa-reply"></i> Ver respuestas / Responder</button>
                    </div>
                `;
            });
        } catch (error) {
            console.error("Error cargando preguntas", error);
        }
    };

    // 3. Crear Nueva Pregunta
    formPregunta.addEventListener('submit', async (e) => {
        e.preventDefault();
        const contenido = document.getElementById('contenidoPregunta').value;

        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ salaId: salaId, contenido: contenido, preguntaPadreId: null }) // null porque es pregunta, no respuesta
            });

            if (resp.ok) {
                document.getElementById('contenidoPregunta').value = ''; // Limpiar textarea

                // UX: Si la sala es moderada, avisamos que no aparecerá de inmediato
                if(salaRequiereModeracion) {
                    mostrarAlerta(mensajeAlerta, "Pregunta enviada. Será visible cuando un moderador la apruebe.", false);
                } else {
                    mostrarAlerta(mensajeAlerta, "¡Pregunta publicada!", false);
                    cargarPreguntas(); // Solo recargamos la tabla si sabemos que se auto-aprobó
                }
            } else {
                mostrarAlerta(mensajeAlerta, "Error al publicar la pregunta", true);
            }
        } catch (error) {
            mostrarAlerta(mensajeAlerta, "Error de red", true);
        }
    });

    cargarDetallesSala();
    cargarPreguntas();
});