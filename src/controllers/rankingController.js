/*import Ranking from "../models/rankingModel.js";
import { validationResult } from "express-validator";

// Obtener todos los rankings de un usuario
export const getRankings = async (req, res) => {
  try {
    const { user_id } = req.user; // Se asume que el ID de usuario viene del token
    const rankings = await Ranking.findAll({ where: { user_id } });
    return res.status(200).json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return res.status(500).json({ message: "Error fetching rankings." });
  }
};

// Obtener la calificación promedio de una receta específica
export const getAverageRating = async (req, res) => {
  try {
    const { recipe_id } = req.params;
    
    // Verificar que el ID de la receta esté presente
    if (!recipe_id) {
      return res.status(400).json({ message: "Missing recipe_id." });
    }

    // Calcular el promedio de la calificación de la receta
    const averageRating = await Ranking.findOne({
      where: { recipe_id },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']],
    });

    if (averageRating) {
      return res.status(200).json({ averageRating: averageRating.get('averageRating') });
    } else {
      return res.status(404).json({ message: "No ratings found for this recipe." });
    }
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return res.status(500).json({ message: "Error fetching average rating." });
  }
};


// Obtener un ranking por ID
export const getRankingById = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await Ranking.findByPk(id);
    if (!ranking) {
      return res.status(404).json({ message: "Ranking not found." });
    }
    return res.status(200).json(ranking);
  } catch (error) {
    console.error("Error fetching ranking by ID:", error);
    return res.status(500).json({ message: "Error fetching ranking by ID." });
  }
};

// Añadir o actualizar una valoración (ranking)
export const addOrUpdateRanking = async (req, res) => {
  try {
    const user_id = req.user.id_user;
    console.log('Controlador - user_id:', user_id);  // <-- Agrega este console.log
    const { recipe_id, rating } = req.body;

    // Debugging para verificar valores
    console.log("User ID:", user_id); // Confirmar que user_id no sea undefined
    console.log("Recipe ID:", recipe_id);
    console.log("Rating:", rating);

     // Verificar que todos los campos necesarios están presentes
     if (!user_id || !recipe_id || !rating) {
      return res.status(400).json({ message: "Missing user_id, recipe_id, or rating." });
    }

    // Buscar si ya existe una valoración para esta receta y usuario
    const existingRanking = await Ranking.findOne({
      where: { user_id, recipe_id },
    });

    if (existingRanking) {
      // Si ya existe, actualizar el ranking
      existingRanking.rating = rating;
      await existingRanking.save();
      return res.status(200).json(existingRanking);
    } else {
      // Si no existe, crear una nueva valoración
      const newRanking = await Ranking.create({ user_id, recipe_id, rating });
      return res.status(201).json(newRanking);
    }
  } catch (error) {
    console.error("Error adding or updating ranking:", error);
    return res
      .status(500)
      .json({ message: "Error adding or updating ranking." });
  }
};

// Eliminar una valoración (ranking)
export const deleteRanking = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await Ranking.destroy({ where: { id } });

    if (!ranking) {
      return res.status(404).json({ message: "Ranking not found." });
    }

    return res.status(200).json({ message: "Ranking removed successfully." });
  } catch (error) {
    console.error("Error deleting ranking:", error);
    return res.status(500).json({ message: "Error deleting ranking." });
  }
};*/

import Ranking from "../models/rankingModel.js";
import { validationResult } from "express-validator";

// Obtener todos los rankings de un usuario
export const getRankings = async (req, res) => {
  try {
    const { user_id } = req.user; // Se asume que el ID de usuario viene del token
    const rankings = await Ranking.findAll({ where: { user_id } });
    return res.status(200).json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return res.status(500).json({ message: "Error fetching rankings." });
  }
};

// Obtener todas las calificaciones de una receta específica (sin calcular el promedio)
export const getRecipeRatings = async (req, res) => {
  try {
    const { recipe_id } = req.params;
    
    if (!recipe_id) {
      return res.status(400).json({ message: "Missing recipe_id." });
    }

    // Obtiene todas las calificaciones para la receta especificada
    const ratings = await Ranking.findAll({
      where: { recipe_id },
      attributes: ['rating'],
    });

    if (ratings.length === 0) {
      return res.status(404).json({ message: "No ratings found for this recipe." });
    }

    return res.status(200).json({ ratings: ratings.map(r => r.rating) });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return res.status(500).json({ message: "Error fetching ratings." });
  }
};

// Obtener un ranking por ID
export const getRankingById = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await Ranking.findByPk(id);
    if (!ranking) {
      return res.status(404).json({ message: "Ranking not found." });
    }
    return res.status(200).json(ranking);
  } catch (error) {
    console.error("Error fetching ranking by ID:", error);
    return res.status(500).json({ message: "Error fetching ranking by ID." });
  }
};

// Añadir o actualizar una valoración (ranking)
export const addOrUpdateRanking = async (req, res) => {
  try {
    const user_id = req.user.id_user;
    const { recipe_id, rating } = req.body;

    // Verificar que todos los campos necesarios están presentes
    if (!user_id || !recipe_id || !rating) {
      return res.status(400).json({ message: "Missing user_id, recipe_id, or rating." });
    }

    // Buscar si ya existe una valoración para esta receta y usuario
    const existingRanking = await Ranking.findOne({
      where: { user_id, recipe_id },
    });

    if (existingRanking) {
      // Si ya existe, actualizar el ranking
      existingRanking.rating = rating;
      await existingRanking.save();
      return res.status(200).json(existingRanking);
    } else {
      // Si no existe, crear una nueva valoración
      const newRanking = await Ranking.create({ user_id, recipe_id, rating });
      return res.status(201).json(newRanking);
    }
  } catch (error) {
    console.error("Error adding or updating ranking:", error);
    return res.status(500).json({ message: "Error adding or updating ranking." });
  }
};

// Eliminar una valoración (ranking)
export const deleteRanking = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await Ranking.destroy({ where: { id } });

    if (!ranking) {
      return res.status(404).json({ message: "Ranking not found." });
    }

    return res.status(200).json({ message: "Ranking removed successfully." });
  } catch (error) {
    console.error("Error deleting ranking:", error);
    return res.status(500).json({ message: "Error deleting ranking." });
  }
};
