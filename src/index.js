import dotenv from 'dotenv';
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
 credentials: true,
 origin: process.env.NODE_ENV === 'production'
   ? 'https://mexi-flex-frontend.vercel.app'
   : 'http://localhost:4200'
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const initializeServer = async () => {
 try {
   await testConnection();
   await insertInitialData();

   app.use("/auth", authRoutes);
   app.use("/users", userRoutes);
   app.use("/recipes", recipeRoutes);
   app.use("/test", testRoutes);
   app.use("/map", mapRoutes);
   app.use("/events", eventRoutes);
   app.use("/rankings", rankingRoutes);
   app.use("/favorites", favoriteRoutes);
   app.use("/uploads", express.static(path.join(__dirname, "uploads")));

   const PORT = process.env.PORT || 3001;
   app.listen(PORT, () => {
     console.log(`Servidor iniciado en el puerto ${PORT}`);
     console.log('Entorno:', process.env.NODE_ENV);
   });
 } catch (error) {
   console.error('Error al iniciar el servidor:', error);
 }
};

initializeServer();

