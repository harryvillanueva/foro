import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const salaId = urlParams.get('id');

    if(!salaId) {
        window.location.href = 'index.html';
        return;
    }

    let salaRequiereModeracion = false;

    const tituloSala = document.getElementById('tituloSala');
    const infoSala = document.getElementById('infoSala');
    const formPregunta = document.getElementById('formPregunta');
    const listaPreguntas = document.getElementById('listaPreguntas');
    const mensajeAlerta = document.getElementById('mensajeAlerta');

    const cargarDetallesSala = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/salas/${salaId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!resp.ok) throw new Error("No se pudo cargar la sala");
            const sala = await resp.json();

            tituloSala.textContent = sala.nombre;
            salaRequiereModeracion = sala.requiereModeracion;

            infoSala.innerHTML = `
                Temática: <span class="text-blue-600 font-bold">${sala.tematica}</span> |
                Moderación: ${salaRequiereModeracion
                    ? '<span class="text-orange-500 font-bold">Activa</span>'
                    : '<span class="text-green-500 font-bold">Desactivada</span>'}
            `;
        } catch (error) {
            console.error(error);
            tituloSala.textContent = "Error al cargar la sala";
        }
    };

    const cargarPreguntas = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones/sala/${salaId}/preguntas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const preguntas = await resp.json();

            listaPreguntas.innerHTML = '';

            if (preguntas.length === 0) {
                listaPreguntas.innerHTML = '<p class="text-gray-500 italic">No hay preguntas en esta sala. ¡Sé el primero en participar!</p>';
                return;
            }

            preguntas.forEach(p => {
                const fecha = new Date(p.fechaCreacion).toLocaleString('es-ES');

                // Lógica para singular o plural
                const textoRespuestas = p.cantidadRespuestas === 1 ? "1 respuesta" : `${p.cantidadRespuestas} respuestas`;

                const card = document.createElement('div');
                card.className = "bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-4";

                // Añadimos la "etiqueta" con el contador de respuestas (cantidadRespuestas)
                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-3">
                        <div class="bg-blue-100 text-blue-800 w-8 h-8 flex items-center justify-center rounded-full font-bold">
                            ${p.autorNombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p class="font-bold text-gray-800 text-sm">${p.autorNombre}</p>
                            <p class="text-xs text-gray-500">${fecha}</p>
                        </div>
                    </div>
                    <p class="text-gray-700 leading-relaxed">${p.contenido}</p>

                    <div class="mt-4 pt-3 border-t flex justify-between items-center">
                        <span class="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                            <i class="fas fa-comment-dots text-blue-400 mr-1"></i> ${textoRespuestas}
                        </span>

                        <button data-id="${p.id}" class="btn-ver-debate text-sm text-blue-600 font-bold hover:underline transition-colors">
                            <i class="fas fa-reply"></i> Ver debate / Responder
                        </button>
                    </div>
                `;
                listaPreguntas.appendChild(card);
            });

            document.querySelectorAll('.btn-ver-debate').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const preguntaId = e.currentTarget.dataset.id;
                    window.location.href = `pregunta.html?id=${preguntaId}`;
                });
            });

        } catch (error) {
            console.error("Error cargando preguntas", error);
            listaPreguntas.innerHTML = '<p class="text-red-500">Error al conectar con el servidor.</p>';
        }
    };

    formPregunta.addEventListener('submit', async (e) => {
        e.preventDefault();
        const contenidoInput = document.getElementById('contenidoPregunta');
        const contenido = contenidoInput.value;

        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    salaId: salaId,
                    contenido: contenido,
                    preguntaPadreId: null
                })
            });

            if (resp.ok) {
                contenidoInput.value = '';
                if (salaRequiereModeracion) {
                    mostrarAlerta(mensajeAlerta, "Pregunta enviada. Aparecerá cuando un moderador la apruebe.", false);
                } else {
                    mostrarAlerta(mensajeAlerta, "¡Pregunta publicada con éxito!", false);
                    cargarPreguntas();
                }
            } else {
                mostrarAlerta(mensajeAlerta, "No se pudo publicar la pregunta. Revisa tu conexión.", true);
            }
        } catch (error) {
            mostrarAlerta(mensajeAlerta, "Error de red al intentar publicar.", true);
        }
    });

    cargarDetallesSala();
    cargarPreguntas();
});