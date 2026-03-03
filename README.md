# Don Pollo - Plataforma B2C/B2B

Este proyecto es una plataforma web completa (Full-Stack) que sigue una arquitectura MVC estricta y se compone de tres partes principales: Base de Datos, Backend y Frontend.

## Requisitos Previos
1. Tener **Node.js** instalado (versión 18 o superior recomendada).
2. Tener **Docker Desktop** instalado y en ejecución (para la base de datos).

---

## Instrucciones para Ejecutar el Proyecto Localmente

Para iniciar toda la aplicación, se debe abrir **tres (3) terminales diferentes**, una para cada servicio:

### 1. Levantar la Base de Datos (PostgreSQL & pgAdmin)
Abrir una terminal en la raíz del proyecto (`DonPolloV1`) y ejecuta:
```bash
docker-compose up -d
```
*   **PostgreSQL** estará disponible en el puerto `5432`.
*   **pgAdmin** (Interfaz gráfica de la BBDD) estará disponible en http://localhost:5050 (Credenciales: `admin@donpollo.com` / `admin`).

### 2. Iniciar el Backend (NestJS)
Abrir *otra* terminal. Entra a la carpeta `backend` e inicia el servidor en modo desarrollo:
```bash
cd backend
npm install
npm run start:dev
```
*   La API del backend quedará corriendo en http://localhost:3000.

### 3. Iniciar el Frontend (React + Vite)
Abrir una *tercera* terminal. Entra a la carpeta `frontend` e inicia el servidor de desarrollo:
```bash
cd frontend
npm install
npm run dev
```
*   La aplicación web (UI) estará disponible en tu navegador en http://localhost:5173 (o `5174` dependiendo del puerto libre).

---