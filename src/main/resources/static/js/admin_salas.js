import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');

    // Validación de seguridad (El portero)
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.rol !== 'SUPERADMIN') {
        alert("Acceso denegado. No eres Superadministrador.");
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('formCrearSala');
    const tablaSalas = document.getElementById('listaSalas');
    const contenedorAlerta = document.getElementById('mensajeAlerta');

    // 1. Función "Inteligente" para cargar salas con sus moderadores
    const cargarSalas = async () => {
        try {
            // A. Traemos todos los moderadores
            const respMods = await fetch(`${API_BASE_URL}/admin/moderadores`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const moderadores = await respMods.json();

            // Creamos un diccionario rápido { id: "Nombre del Moderador" }
            const mapaModeradores = {};
            moderadores.forEach(mod => {
                mapaModeradores[mod.id] = mod.nombre;
            });

            // B. Traemos todas las salas
            const respSalas = await fetch(`${API_BASE_URL}/salas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const salas = await respSalas.json();

            // C. Pintamos la tabla cruzando los datos
            tablaSalas.innerHTML = '';
            salas.forEach(sala => {

                // Buscamos el nombre del moderador en nuestro diccionario
                let moderadorBadge = `<span class="text-gray-400 italic">Sin asignar</span>`;

                if (sala.moderadorId && mapaModeradores[sala.moderadorId]) {
                    moderadorBadge = `<span class="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded">
                                        <i class="fas fa-user-shield mr-1"></i> ${mapaModeradores[sala.moderadorId]}
                                      </span>`;
                }

                tablaSalas.innerHTML += `
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="p-2 border font-medium">${sala.nombre}</td>
                        <td class="p-2 border">${sala.tematica}</td>
                        <td class="p-2 border text-center">${sala.requiereModeracion ? '✅' : '❌'}</td>
                        <td class="p-2 border">${moderadorBadge}</td>
                    </tr>`;
            });
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    // 2. Manejar creación de sala
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const datos = {
            nombre: document.getElementById('nombreSala').value,
            tematica: document.getElementById('tematicaSala').value,
            requiereModeracion: document.getElementById('modSala').checked
        };

        try {
            const resp = await fetch(`${API_BASE_URL}/salas/admin/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            if (resp.ok) {
                mostrarAlerta(contenedorAlerta, "Sala creada con éxito", false);
                form.reset();
                cargarSalas(); // Recargamos la tabla al instante
            } else {
                const errorText = await resp.text();
                mostrarAlerta(contenedorAlerta, errorText, true);
            }
        } catch (error) {
            mostrarAlerta(contenedorAlerta, "Error de conexión", true);
        }
    });

    // Arrancamos la carga al abrir la página
    cargarSalas();
});