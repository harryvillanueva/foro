import { API_BASE_URL, mostrarAlerta } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioLogin');
    const contenedorAlerta = document.getElementById('mensajeAlerta');

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const respuesta = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (respuesta.ok) {
                // Obtenemos el token del backend
                const token = await respuesta.text();

                // ¡LA MAGIA! Guardamos el token en el LocalStorage del navegador
                localStorage.setItem('jwt_foro', token);

                mostrarAlerta(contenedorAlerta, "¡Login exitoso! Entrando...", false);

                // Redirigir a la página principal del foro después de 1 segundo
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                const errorServidor = await respuesta.text();
                mostrarAlerta(contenedorAlerta, errorServidor, true);
            }
        } catch (error) {
            console.error("Error:", error);
            mostrarAlerta(contenedorAlerta, "Error de conexión con el servidor.", true);
        }
    });
});