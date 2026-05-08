# Foro DAW - Plataforma de Gestión de Debates y Moderación

Este proyecto es una aplicación web robusta diseñada para la gestión de comunidades, salas de debate y moderación multinivel. Está construido siguiendo principios de **Arquitectura Hexagonal** y **Clean Architecture** utilizando el ecosistema de Spring Boot.

## 🚀 Tecnologías Utilizadas

### Backend
* **Java 17** & **Spring Boot 3**
* **Spring Security & JWT**: Autenticación "stateless" y control de acceso basado en roles.
* **Spring Data JPA**: Persistencia de datos y mapeo objeto-relacional (ORM).
* **MySQL**: Base de datos relacional para la gestión de usuarios, salas y publicaciones.

### Frontend
* **HTML5 & Tailwind CSS**: Interfaz moderna, responsiva y con soporte nativo para **Modo Oscuro**.
* **Vanilla JavaScript (ES6+)**: Lógica de cliente asíncrona mediante **Fetch API**.
* **SweetAlert2**: Notificaciones y alertas interactivas y elegantes.
* **i18n**: Motor de traducción bilingüe (Español/Inglés) integrado en el frontend.

## 🏛️ Arquitectura

El sistema implementa una **Arquitectura Hexagonal (Puertos y Adaptadores)** que separa el dominio de la aplicación de las dependencias externas:

* **Dominio**: Entidades puras y reglas de negocio (Usuarios, Salas, Publicaciones).
* **Aplicación**: Casos de uso que orquestan el comportamiento del sistema.
* **Infraestructura**: Adaptadores de entrada (Controladores REST, Filtros JWT) y salida (Repositorios JPA).

## ✨ Funcionalidades Clave

* **Control Multinivel**: Roles diferenciados para Participantes, Moderadores y Superadministradores.
* **Gestión de Salas**: Los Superadmins pueden crear/eliminar salas y asignar moderadores (máx. 2 por moderador).
* **Moderación Dinámica**: Aprobación o rechazo de contenido en tiempo real para salas con moderación activa.
* **Sanciones y Bloqueos**: Sistema de avisos, bloqueos temporales por sala y baneo global de cuentas.
* **Interacción Social**: Suscripciones a salas, marcación de favoritos y motor de menciones (@usuario) con notificaciones automáticas.
* **Límites de Publicación**: Control de spam mediante límites de preguntas semanales configurables por sala.

## 🛠️ Configuración e Instalación

1.  **Requisitos**: JDK 17 o superior y MySQL Server.
2.  **Base de Datos**: Crear una base de datos llamada `foro` en MySQL.
3.  **Configuración**: Ajustar las credenciales en `src/main/resources/application.properties`.
4.  **Ejecución**:
    ```bash
    ./mvnw spring-boot:run
    ```
5.  **Acceso**: Abrir en el navegador `http://localhost:8080/index.html`.

## 👤 Autor
Proyecto desarrollado para el entorno de Desarrollo de Aplicaciones Web (DAW).
