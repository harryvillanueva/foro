
import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioRegistro');
    const contenedorAlerta = document.getElementById('mensajeAlerta');

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const datosRegistro = {
            nombre: nombre,
            email: email,
            password: password
        };

        try {
            const respuesta = await fetch(`${API_BASE_URL}/auth/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosRegistro)
            });

            if (respuesta.ok) {
                const mensajeServidor = await respuesta.text();
                mostrarAlerta(contenedorAlerta, mensajeServidor, false);
                formulario.reset();

            } else {
                const errorServidor = await respuesta.text();
                mostrarAlerta(contenedorAlerta, errorServidor, true);
            }

        } catch (error) {
            console.error("Error en la petición:", error);
            mostrarAlerta(contenedorAlerta, "Error de conexión con el servidor. Intenta más tarde.", true);
        }
    });
});