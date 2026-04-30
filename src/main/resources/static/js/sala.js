import { API_BASE_URL, mostrarAlerta, initGlobalFeatures, diccionario, obtenerIdiomaActual, swalCustom } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalFeatures();

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

    const formatearMenciones = (texto) => texto.replace(/@([a-zA-Z0-9_]+)/g, '<span class="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-1 rounded cursor-pointer">@$1</span>');

    const cargarDetallesSala = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/salas/${salaId}`, { headers: { 'Authorization': `Bearer ${token}` }});

            if (!resp.ok) {
                await swalCustom().fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: await resp.text(),
                    confirmButtonText: 'Entendido'
                });
                window.location.href = 'index.html';
                return;
            }

            const sala = await resp.json();
            tituloSala.textContent = sala.nombre;
            salaRequiereModeracion = sala.requiereModeracion;
            infoSala.innerHTML = `Temática: <span class="text-blue-600 dark:text-blue-400 font-bold">${sala.tematica}</span> | Moderación: ${salaRequiereModeracion ? 'Activa' : 'Desactivada'}`;

            await actualizarControlesSuscripcion();
        } catch (error) { console.error(error); }
    };

    const actualizarControlesSuscripcion = async () => {
        const resp = await fetch(`${API_BASE_URL}/suscripciones/mis-suscripciones`, { headers: { 'Authorization': `Bearer ${token}` }});
        const suscripciones = await resp.json();
        const sub = suscripciones.find(s => s.salaId == salaId);

        const lang = obtenerIdiomaActual();
        const txtSub = diccionario[lang]["btn.suscribir"];
        const txtUnsub = diccionario[lang]["btn.desuscribir"];

        controlesSub.innerHTML = '';
        if (sub) {
            const btnFav = document.createElement('button');
            btnFav.className = `px-4 py-2 rounded-lg border font-bold transition ${sub.esFavorita ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400 border-orange-200 dark:border-orange-700' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'}`;
            btnFav.innerHTML = `<i class="fa${sub.esFavorita ? 's' : 'r'} fa-star"></i>`;
            btnFav.onclick = async () => {
                await fetch(`${API_BASE_URL}/suscripciones/sala/${salaId}/favorito`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                actualizarControlesSuscripcion();
            };

            const btnUnsub = document.createElement('button');
            btnUnsub.className = "px-4 py-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold hover:bg-red-600 hover:text-white transition";
            btnUnsub.textContent = txtUnsub;
            btnUnsub.onclick = async () => {
                await fetch(`${API_BASE_URL}/suscripciones/sala/${salaId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                actualizarControlesSuscripcion();
            };

            controlesSub.appendChild(btnFav);
            controlesSub.appendChild(btnUnsub);
        } else {
            const btnSub = document.createElement('button');
            btnSub.className = "px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md transition";
            btnSub.textContent = txtSub;
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

            listaPreguntas.innerHTML = preguntas.length === 0 ? '<p class="text-gray-500 dark:text-gray-400 italic">Sin preguntas todavía.</p>' : '';

            preguntas.forEach(p => {
                const card = document.createElement('div');
                card.className = "bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4 transition-colors";
                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-3">
                        <div class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-8 h-8 flex items-center justify-center rounded-full font-bold">${p.autorNombre.charAt(0).toUpperCase()}</div>
                        <div>
                            <p class="font-bold text-gray-800 dark:text-white text-sm">${p.autorNombre}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">${new Date(p.fechaCreacion).toLocaleString()}</p>
                        </div>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${formatearMenciones(p.contenido)}</p>
                    <div class="mt-4 pt-3 border-t dark:border-gray-700 flex justify-between items-center">
                        <span class="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"><i class="fas fa-comment-dots text-blue-400"></i> ${p.cantidadRespuestas} res</span>
                        <button data-id="${p.id}" class="btn-ver-debate text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">Ver / Responder</button>
                    </div>
                `;
                listaPreguntas.appendChild(card);
            });

            document.querySelectorAll('.btn-ver-debate').forEach(b => b.addEventListener('click', (e) => {
                window.location.href = `pregunta.html?id=${e.currentTarget.dataset.id}`;
            }));
        } catch (error) { console.error(error); }
    };

    formPregunta.addEventListener('submit', async (e) => {
        e.preventDefault();
        const contenidoInput = document.getElementById('contenidoPregunta');

        try {
            const resp = await fetch(`${API_BASE_URL}/publicaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ salaId: salaId, contenido: contenidoInput.value, preguntaPadreId: null })
            });

            if (resp.ok) {
                contenidoInput.value = '';
                mostrarAlerta(null, salaRequiereModeracion ? "Enviada a moderación." : "¡Publicada con éxito!", false);
                if(!salaRequiereModeracion) cargarPreguntas();
            } else {
                mostrarAlerta(null, await resp.text(), true);
            }
        } catch (error) {
            mostrarAlerta(null, "Error de red al intentar publicar.", true);
        }
    });
    document.getElementById('btn-lang-es')?.addEventListener('click', actualizarControlesSuscripcion);
    document.getElementById('btn-lang-en')?.addEventListener('click', actualizarControlesSuscripcion);

    cargarDetallesSala();
    cargarPreguntas();
});