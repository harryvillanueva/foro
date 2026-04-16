import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    // Obtener ID de la pregunta desde la URL (ej: pregunta.html?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const preguntaId = urlParams.get('id');

    if(!preguntaId) { window.location.href = 'index.html'; return; }

    let salaIdActual = null;
    let requiereModeracion = false;

    // DOM Elements
    const contenedorPregunta = document.getElementById('contenedorPregunta');
    const listaRespuestas = document.getElementById('listaRespuestas');
    const formResponder = document.getElementById('formResponder');
    const mensajeAlerta = document.getElementById('mensajeAlerta');
    const btnVolverSala = document.getElementById('btnVolverSala');

    // 1. Cargar la pregunta y sus respuestas
    const cargarDebate = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones/pregunta/${preguntaId}/detalles`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await resp.json();

            const pregunta = data.pregunta;
            const respuestas = data.respuestas;

            // Guardamos el ID de la sala para saber a dónde volver y para publicar
            salaIdActual = pregunta.salaId;
            btnVolverSala.onclick = () => window.location.href = `sala.html?id=${salaIdActual}`;

            // Verificamos si la sala está moderada (hacemos un fetch rápido a la sala)
            const respSala = await fetch(`${API_BASE_URL}/salas/${salaIdActual}`, { headers: { 'Authorization': `Bearer ${token}` }});
            const salaData = await respSala.json();
            requiereModeracion = salaData.requiereModeracion;

            if(requiereModeracion) {
                document.getElementById('alertaModeracion').classList.remove('hidden');
            }

            // Pintar la Pregunta Principal
            contenedorPregunta.innerHTML = `
                <div class="flex items-center gap-3 mb-4 border-b pb-3">
                    <div class="bg-blue-800 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg">
                        ${pregunta.autorNombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">${pregunta.autorNombre}</p>
                        <p class="text-xs text-gray-500"><i class="far fa-clock"></i> ${new Date(pregunta.fechaCreacion).toLocaleString()}</p>
                    </div>
                </div>
                <p class="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">${pregunta.contenido}</p>
            `;

            // Pintar las Respuestas
            listaRespuestas.innerHTML = '';
            if(respuestas.length === 0) {
                listaRespuestas.innerHTML = '<p class="text-gray-500 italic">No hay respuestas aún. ¡Sé el primero en aportar!</p>';
            } else {
                respuestas.forEach(r => {
                    listaRespuestas.innerHTML += `
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-bold text-blue-700 text-sm">${r.autorNombre}</span>
                                <span class="text-xs text-gray-400">${new Date(r.fechaCreacion).toLocaleString()}</span>
                            </div>
                            <p class="text-gray-700 text-sm whitespace-pre-wrap">${r.contenido}</p>
                        </div>
                    `;
                });
            }
        } catch (error) {
            contenedorPregunta.innerHTML = '<p class="text-red-500 font-bold">Error al cargar el debate.</p>';
        }
    };

    // 2. Enviar Respuesta
    formResponder.addEventListener('submit', async (e) => {
        e.preventDefault();
        const contenido = document.getElementById('contenidoRespuesta').value;

        try {
            // Usamos nuestro mismo endpoint de publicar, pero pasándole el preguntaPadreId
            const resp = await fetch(`${API_BASE_URL}/publicaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    salaId: salaIdActual,
                    contenido: contenido,
                    preguntaPadreId: preguntaId // ¡AQUÍ ESTÁ LA MAGIA!
                })
            });

            if (resp.ok) {
                document.getElementById('contenidoRespuesta').value = '';

                if(requiereModeracion) {
                    mostrarAlerta(mensajeAlerta, "Respuesta enviada a moderación.", false);
                } else {
                    mostrarAlerta(mensajeAlerta, "¡Respuesta publicada!", false);
                    cargarDebate(); // Recargamos para verla instantáneamente
                }
            } else {
                mostrarAlerta(mensajeAlerta, "Error al publicar la respuesta.", true);
            }
        } catch (error) {
            mostrarAlerta(mensajeAlerta, "Error de red.", true);
        }
    });

    cargarDebate();
});