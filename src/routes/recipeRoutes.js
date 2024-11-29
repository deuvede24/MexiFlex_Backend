import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  generateRecipeWithAI,
  addRecipe,
  getSharedRecipe,  // Añade esta importación
} from "../controllers/recipeController.js"; // Agregamos la nueva función para la generación de recetas
import {
  getIngredientsByRecipeId,
  getAllIngredients,
} from "../controllers/recipeIngredientController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { idValidator } from "../validations/genericValidation.js";
import { uploadFileMiddleware } from '../middlewares/upload.js';  // Asegúrate de importar el middleware

const router = Router();

// **Rutas globales de ingredientes** - Estas rutas deben ir primero para evitar conflictos
router.get("/ingredients", getAllIngredients); // Obtener todos los ingredientes globales

// **Rutas de recetas (solo lectura)**
router.get("/", authenticateToken(), getRecipes); // Usuarios autenticados pueden ver las recetas
router.get("/:id", authenticateToken(), idValidator, getRecipeById); // Usuarios autenticados pueden ver una receta por ID

// Nueva ruta específica para compartir (sin autenticación)
router.get("/:id/shared", idValidator, getSharedRecipe); // Nueva ruta solo para compartir

// **Ruta para generar recetas con la API de OpenAI**
router.post("/generate", authenticateToken(), generateRecipeWithAI); // Usuarios autenticados pueden generar recetas con la API de OpenAI

router.post("/", authenticateToken(), uploadFileMiddleware, addRecipe); // Usa el middleware aquí para subir la receta con imagen

// **Rutas para ver ingredientes dentro de una receta**
router.get("/:recipeId/ingredients", authenticateToken(), idValidator, getIngredientsByRecipeId); // Obtener todos los ingredientes de una receta específica solo para usuarios autenticados

export default router;