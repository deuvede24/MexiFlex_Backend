import Recipe from "../models/recipeModel.js";
import { Sequelize } from "sequelize";

// Obtener el conteo de recetas por categoría
export const getRecipeCategoryCount = async (req, res) => {
  try {
    const categoryCounts = await Recipe.findAll({
      attributes: [
        'category',
        [Sequelize.fn('COUNT', Sequelize.col('category')), 'count'],
      ],
      group: ['category'],
    });

    console.log("Resultado del conteo de recetas por categoría:", categoryCounts);
    res.status(200).json({
      code: 1,
      message: "Recipe category count",
      data: categoryCounts,
    });
  } catch (error) {
    console.error("Error al obtener el conteo de recetas por categoría:", error);
    res.status(500).json({
      message: "Error al obtener el conteo de recetas por categoría",
      error: error,
    });
  }
};