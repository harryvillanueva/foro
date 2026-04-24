import { API_BASE_URL, mostrarAlerta, initGlobalFeatures } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalFeatures();
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    const urlParams = new URLSearchParams(window.location.search);
    const preguntaId = urlParams.get('id');
    if(!preguntaId) { window.location.href = 'index.html'; return; }

    let salaIdActual = null;
    let requiereModeracion = false;

    const contenedorPregunta = document.getElementById('contenedorPregunta');
    const listaRespuestas = document.getElementById('listaRespuestas');
    const formResponder = document.getElementById('formResponder');
    const mensajeAlerta = document.getElementById('mensajeAlerta');
    const btnVolverSala = document.getElementById('btnVolverSala');

    const formatearMenciones = (texto) => {
        return texto.replace(/@([a-zA-Z0-9_]+)/g, '<span class="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-1 rounded cursor-pointer">@$1</span>');
    };

    const cargarDebate = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones/pregunta/${preguntaId}/detalles`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await resp.json();

            salaIdActual = data.pregunta.salaId;
            btnVolverSala.onclick = () => window.location.href = `sala.html?id=${salaIdActual}`;

            const respSala = await fetch(`${API_BASE_URL}/salas/${salaIdActual}`, { headers: { 'Authorization': `Bearer ${token}` }});
            const salaData = await respSala.json();
            requiereModeracion = salaData.requiereModeracion;
            if(requiereModeracion) document.getElementById('alertaModeracion').classList.remove('hidden');

            contenedorPregunta.innerHTML = `
                <div class="flex items-center gap-3 mb-4 border-b dark:border-gray-700 pb-3">
                    <div class="bg-blue-800 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg">${data.pregunta.autorNombre.charAt(0).toUpperCase()}</div>
                    <div>
                        <p class="font-bold text-gray-900 dark:text-white">${data.pregunta.autorNombre}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400"><i class="far fa-clock"></i> ${new Date(data.pregunta.fechaCreacion).toLocaleString()}</p>
                    </div>
                </div>
                <p class="text-gray-800 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">${formatearMenciones(data.pregunta.contenido)}</p>
            `;

            listaRespuestas.innerHTML = '';
            if(data.respuestas.length === 0) {
                listaRespuestas.innerHTML = '<p class="text-gray-500 dark:text-gray-400 italic">No hay respuestas aún.</p>';
            } else {
                data.respuestas.forEach(r => {
                    listaRespuestas.innerHTML += `
                        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-bold text-blue-700 dark:text-blue-400 text-sm">${r.autorNombre}</span>
                                <span class="text-xs text-gray-400 dark:text-gray-500">${new Date(r.fechaCreacion).toLocaleString()}</span>
                            </div>
                            <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">${formatearMenciones(r.contenido)}</p>
                        </div>
                    `;
                });
            }
        } catch (error) { contenedorPregunta.innerHTML = '<p class="text-red-500 font-bold">Error al cargar el debate.</p>'; }
    };

    formResponder.addEventListener('submit', async (e) => {
        e.preventDefault();
        const contenido = document.getElementById('contenidoRespuesta').value;
        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ salaId: salaIdActual, contenido: contenido, preguntaPadreId: preguntaId })
            });

            if (resp.ok) {
                document.getElementById('contenidoRespuesta').value = '';
                mostrarAlerta(mensajeAlerta, requiereModeracion ? "Respuesta enviada a moderación." : "¡Respuesta publicada!", false);
                if(!requiereModeracion) cargarDebate();
            } else { mostrarAlerta(mensajeAlerta, await resp.text(), true); }
        } catch (error) { mostrarAlerta(mensajeAlerta, "Error de red.", true); }
    });

    cargarDebate();
});