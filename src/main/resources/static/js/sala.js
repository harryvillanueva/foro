import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');
    if (!token) { window.location.href = 'login.html'; return; }

    const urlParams = new URLSearchParams(window.location.search);
    const salaId = urlParams.get('id');
    if(!salaId) { window.location.href = 'index.html'; return; }

    let salaRequiereModeracion = false;

    const tituloSala = document.getElementById('tituloSala');
    const infoSala = document.getElementById('infoSala');
    const controlesSub = document.getElementById('controles-suscripcion');
    const formPregunta = document.getElementById('formPregunta');
    const listaPreguntas = document.getElementById('listaPreguntas');
    const mensajeAlerta = document.getElementById('mensajeAlerta');

    const cargarDetallesSala = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/salas/${salaId}`, { headers: { 'Authorization': `Bearer ${token}` }});

            // MAGIA 1: Si el backend nos rechaza el ingreso (Error 403 por Bloqueo)
            if (!resp.ok) {
                const errorBloqueo = await resp.text();
                alert(errorBloqueo); // Alerta nativa obligatoria
                window.location.href = 'index.html'; // Lo expulsamos a la fuerza
                return;
            }

            const sala = await resp.json();
            tituloSala.textContent = sala.nombre;
            salaRequiereModeracion = sala.requiereModeracion;
            infoSala.innerHTML = `Temática: <span class="text-blue-600">${sala.tematica}</span> | Moderación: ${salaRequiereModeracion ? 'Activa' : 'Desactivada'}`;

            await actualizarControlesSuscripcion();
        } catch (error) { console.error(error); }
    };

    const actualizarControlesSuscripcion = async () => {
        const resp = await fetch(`${API_BASE_URL}/suscripciones/mis-suscripciones`, { headers: { 'Authorization': `Bearer ${token}` }});
        const suscripciones = await resp.json();
        const sub = suscripciones.find(s => s.salaId == salaId);

        controlesSub.innerHTML = '';
        if (sub) {
            const btnFav = document.createElement('button');
            btnFav.className = `px-4 py-2 rounded-lg border font-bold transition ${sub.esFavorita ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`;
            btnFav.innerHTML = `<i class="fa${sub.esFavorita ? 's' : 'r'} fa-star"></i>`;
            btnFav.onclick = async () => {
                await fetch(`${API_BASE_URL}/suscripciones/sala/${salaId}/favorito`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                actualizarControlesSuscripcion();
            };

            const btnUnsub = document.createElement('button');
            btnUnsub.className = "px-4 py-2 rounded-lg bg-red-100 text-red-600 border border-red-200 font-bold hover:bg-red-600 hover:text-white transition";
            btnUnsub.textContent = "Anular Suscripción";
            btnUnsub.onclick = async () => {
                await fetch(`${API_BASE_URL}/suscripciones/sala/${salaId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                actualizarControlesSuscripcion();
            };
            controlesSub.appendChild(btnFav);
            controlesSub.appendChild(btnUnsub);
        } else {
            const btnSub = document.createElement('button');
            btnSub.className = "px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md transition";
            btnSub.textContent = "Suscribirme";
            btnSub.onclick = async () => {
                await fetch(`${API_BASE_URL}/suscripciones/sala/${salaId}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                actualizarControlesSuscripcion();
            };
            controlesSub.appendChild(btnSub);
        }
    };

    const cargarPreguntas = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones/sala/${salaId}/preguntas`, { headers: { 'Authorization': `Bearer ${token}` }});
            const preguntas = await resp.json();
            listaPreguntas.innerHTML = preguntas.length === 0 ? '<p class="text-gray-500 italic">Sin preguntas todavía.</p>' : '';
            preguntas.forEach(p => {
                const card = document.createElement('div');
                card.className = "bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-4";
                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-3">
                        <div class="bg-blue-100 text-blue-800 w-8 h-8 flex items-center justify-center rounded-full font-bold">${p.autorNombre.charAt(0).toUpperCase()}</div>
                        <div><p class="font-bold text-gray-800 text-sm">${p.autorNombre}</p><p class="text-xs text-gray-500">${new Date(p.fechaCreacion).toLocaleString()}</p></div>
                    </div>
                    <p class="text-gray-700 leading-relaxed">${p.contenido}</p>
                    <div class="mt-4 pt-3 border-t flex justify-between items-center">
                        <span class="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full"><i class="fas fa-comment-dots text-blue-400"></i> ${p.cantidadRespuestas} respuestas</span>
                        <button data-id="${p.id}" class="btn-ver-debate text-sm text-blue-600 font-bold hover:underline">Ver debate / Responder</button>
                    </div>
                `;
                listaPreguntas.appendChild(card);
            });
            document.querySelectorAll('.btn-ver-debate').forEach(b => b.addEventListener('click', (e) => { window.location.href = `pregunta.html?id=${e.currentTarget.dataset.id}`; }));
        } catch (error) { console.error(error); }
    };

    formPregunta.addEventListener('submit', async (e) => {
        e.preventDefault();
        const contenidoInput = document.getElementById('contenidoPregunta');
        const contenido = contenidoInput.value;

        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ salaId: salaId, contenido: contenido, preguntaPadreId: null })
            });

            if (resp.ok) {
                contenidoInput.value = '';
                mostrarAlerta(mensajeAlerta, salaRequiereModeracion ? "Enviada a moderación." : "¡Publicada!", false);
                if(!salaRequiereModeracion) cargarPreguntas();
            } else {
                // MAGIA 2: Extraemos el texto de error del backend (Ej: Límite superado)
                const errorTexto = await resp.text();
                mostrarAlerta(mensajeAlerta, errorTexto, true);
            }
        } catch (error) {
            mostrarAlerta(mensajeAlerta, "Error de red", true);
        }
    });

    cargarDetallesSala();
    cargarPreguntas();
});