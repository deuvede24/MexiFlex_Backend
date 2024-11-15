import { Router } from "express";
import { getMapLocations, getLocationById } from "../controllers/mapController.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Ruta para obtener el token de Mapbox
router.get("/token", (req, res) => {
  res.json({ mapboxToken: process.env.MAPBOX_TOKEN });
});

// Ruta para obtener todas las ubicaciones
router.get("/locations", getMapLocations);

// Ruta para obtener una ubicación específica por ID (opcional)
router.get("/locations/:id", getLocationById);

export default router;
