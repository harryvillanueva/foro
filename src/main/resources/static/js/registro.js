// js/registro.js

// Importamos lo que necesitamos de nuestro archivo principal
import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioRegistro');
    const contenedorAlerta = document.getElementById('mensajeAlerta');

    formulario.addEventListener('submit', async (evento) => {
        // Evitamos que la página se recargue al enviar el formulario
        evento.preventDefault();

        // Extraemos los valores de los inputs
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Construimos el objeto que espera nuestro DTO en Spring Boot
        const datosRegistro = {
            nombre: nombre,
            email: email,
            password: password
        };

        try {
            // Realizamos la petición HTTP POST usando fetch API (nativa de JS)
            const respuesta = await fetch(`${API_BASE_URL}/auth/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosRegistro)
            });

            // Si Spring Boot responde con un estado 200 (OK)
            if (respuesta.ok) {
                const mensajeServidor = await respuesta.text();
                mostrarAlerta(contenedorAlerta, mensajeServidor, false);
                formulario.reset(); // Limpiamos el formulario

                // Opcional: Redirigir al login después de unos segundos
                // setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                // Si Spring Boot responde con un error (ej. Email ya existe)
                const errorServidor = await respuesta.text();
                mostrarAlerta(contenedorAlerta, errorServidor, true);
            }

        } catch (error) {
            // Si hay un error de red (el servidor Spring Boot está apagado, por ejemplo)
            console.error("Error en la petición:", error);
            mostrarAlerta(contenedorAlerta, "Error de conexión con el servidor. Intenta más tarde.", true);
        }
    });
});