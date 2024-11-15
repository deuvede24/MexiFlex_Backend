// src/index.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js"; // Importar correctamente
import testRoutes from "./routes/testRoutes.js"; // Si esto es necesario
//import mapLocationRoutes from "./routes/mapRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js"; // Nuevas rutas
import favoriteRoutes from "./routes/favoriteRoutes.js"; // Nuevas rutas

import { testConnection } from "./db.js";
import insertInitialData from "./start_data.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configura CORS para permitir solicitudes desde el frontend
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  })
);

// Middleware para analizar cookies y el cuerpo de las solicitudes
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//const initializeServer = async () => {
await testConnection();
await insertInitialData();

// Configurar rutas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/test", testRoutes); // Si esto es necesario
//app.use("/locations", mapLocationRoutes);
app.use("/map", mapRoutes);
app.use("/events", eventRoutes);

// Nuevas rutas para rankings y favoritos
app.use("/rankings", rankingRoutes); // Rutas para rankings
app.use("/favorites", favoriteRoutes); // Rutas para favoritos

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

//initializeServer();

// src/index.js
/*import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import admin from 'firebase-admin';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

import { testConnection } from "./db.js";
import insertInitialData from "./start_data.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Inicializar Firebase Admin
admin.initializeApp({
 credential: admin.credential.cert({
   projectId: process.env.FIREBASE_PROJECT_ID,
   privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
   clientEmail: process.env.FIREBASE_CLIENT_EMAIL
 })
});

// Configura CORS para permitir solicitudes desde el frontend
app.use(
 cors({
   credentials: true,
   origin: "http://localhost:4200",
 })
);

// Middleware para analizar cookies y el cuerpo de las solicitudes
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Inicialización de la base de datos
await testConnection();
await insertInitialData();

// Configurar rutas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/test", testRoutes);
app.use("/map", mapRoutes);
app.use("/events", eventRoutes);
app.use("/rankings", rankingRoutes);
app.use("/favorites", favoriteRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
 console.log(`Servidor iniciado en el puerto ${PORT}`);
});*/
