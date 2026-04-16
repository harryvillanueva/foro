import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_foro');

    // 1. Validar si está logueado
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // 2. Validar si es SUPERADMIN leyendo el token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        if (payload.rol !== 'SUPERADMIN') {
            alert("Acceso denegado. No eres Superadministrador.");
            window.location.href = 'index.html'; // Lo pateamos al inicio
            return;
        }

    // Referencias al DOM
    const formCrearMod = document.getElementById('formCrearModerador');
    const formAsignarMod = document.getElementById('formAsignarModerador');
    const alertaMod = document.getElementById('alertaMod');
    const alertaAsignacion = document.getElementById('alertaAsignacion');

    const selectModerador = document.getElementById('selectModerador');
    const selectSala = document.getElementById('selectSala');
    const tablaModeradores = document.getElementById('listaModeradoresTabla');

    // 1. Cargar lista de moderadores (Para la tabla y el select)
    const cargarModeradores = async () => {
        const resp = await fetch(`${API_BASE_URL}/admin/moderadores`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const moderadores = await resp.json();

        selectModerador.innerHTML = '<option value="">Elige un moderador...</option>';
        tablaModeradores.innerHTML = '';

        moderadores.forEach(mod => {
            // Llenar tabla
            tablaModeradores.innerHTML += `
                <tr>
                    <td class="p-2 border text-gray-500 font-bold">#${mod.id}</td>
                    <td class="p-2 border">${mod.nombre}</td>
                    <td class="p-2 border">${mod.email}</td>
                </tr>`;

            // Llenar select de asignación
            selectModerador.innerHTML += `<option value="${mod.id}">${mod.nombre} (${mod.email})</option>`;
        });
    };

    // 2. Cargar salas (Para el select de asignación)
    const cargarSalas = async () => {
        const resp = await fetch(`${API_BASE_URL}/salas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const salas = await resp.json();

        selectSala.innerHTML = '<option value="">Elige una sala...</option>';
        salas.forEach(sala => {
            selectSala.innerHTML += `<option value="${sala.id}">${sala.nombre} (Mod. ID: ${sala.moderadorId || 'Sin asignar'})</option>`;
        });
    };

    // 3. Crear nuevo moderador
    formCrearMod.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            nombre: document.getElementById('nombreMod').value,
            email: document.getElementById('emailMod').value,
            password: document.getElementById('passwordMod').value
        };

        const resp = await fetch(`${API_BASE_URL}/admin/moderadores/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(datos)
        });

        if (resp.ok) {
            mostrarAlerta(alertaMod, "Moderador creado con éxito.", false);
            formCrearMod.reset();
            cargarModeradores(); // Recargar la lista
        } else {
            const error = await resp.text();
            mostrarAlerta(alertaMod, error, true);
        }
    });

    // 4. Asignar Moderador a Sala
    formAsignarMod.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            moderadorId: selectModerador.value,
            salaId: selectSala.value
        };

        const resp = await fetch(`${API_BASE_URL}/salas/admin/asignar-moderador`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(datos)
        });

        if (resp.ok) {
            mostrarAlerta(alertaAsignacion, "¡Asignación exitosa!", false);
            cargarSalas(); // Recargar para ver el ID actualizado en el select
        } else {
            const error = await resp.text();
            mostrarAlerta(alertaAsignacion, error, true);
        }
    });

    // Inicializar cargando datos
    cargarModeradores();
    cargarSalas();
});