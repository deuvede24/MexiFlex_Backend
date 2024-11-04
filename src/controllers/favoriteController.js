import Favorite from "../models/favoriteModel.js";
import Recipe from '../models/recipeModel.js';

// Obtener todos los favoritos de un usuario

export const getFavoriteRecipes = async (req, res) => {
  try {
    const userId = req.user.id_user; // Asegúrate de que tienes el `user_id` del usuario logueado
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [{
        model: Recipe,
        attributes: [['id_recipe', 'recipe_id'], 'title', 'description'], // Usando alias para `id_recipe`
      }],
    });

    // Formateamos la respuesta para que solo contenga la información necesaria
    const formattedFavorites = favorites.map(fav => ({
      id_recipe: fav.Recipe.id_recipe, // Aseguramos que el campo se llame `id_recipe`
      title: fav.Recipe.title,
      description: fav.Recipe.description,
      // Añade aquí más campos si los necesitas
    }));

    res.json({ data: formattedFavorites });
  } catch (error) {
    console.error('Error al obtener recetas favoritas:', error);
    res.status(500).json({ message: 'Error al obtener recetas favoritas' });
  }
};

// Obtener todos los favoritos de un usuario
export const getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id_user; // Extrae el id_user de req.user asignado por el middleware
    console.log("Fetching favorites for user_id:", user_id); // Debugging
    const favorites = await Favorite.findAll({ where: { user_id } });
    console.log("Fetched favorites:", favorites); // Debugging
    return res.status(200).json({ data: favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res.status(500).json({ message: "Error fetching favorites." });
  }
};

// Obtener un favorito por ID
export const getFavoriteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching favorite by ID:", id); // Debugging
    const favorite = await Favorite.findByPk(id);
    if (!favorite) {
      console.log("Favorite not found."); // Debugging
      return res.status(404).json({ message: "Favorite not found." });
    }
    console.log("Fetched favorite:", favorite); // Debugging
    return res.status(200).json(favorite);
  } catch (error) {
    console.error("Error fetching favorite by ID:", error);
    return res.status(500).json({ message: "Error fetching favorite by ID." });
  }
};

// Añadir una receta a favoritos
/*export const addFavorite = async (req, res) => {
  try {
    const { user_id } = req.user; // Obtener user_id desde el token
    const { recipe_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    const existingFavorite = await Favorite.findOne({
      where: { user_id, recipe_id },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Recipe is already in favorites." });
    }

    const favorite = await Favorite.create({ user_id, recipe_id });
    return res.status(201).json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).json({ message: "Error adding favorite." });
  }
};*/

// Añadir una receta a favoritos
export const addFavorite = async (req, res) => {
  try {
    const user_id = req.user.id_user; // Extrae el id_user de req.user
    const { recipe_id } = req.body;
    console.log(
      "Adding favorite for user_id:",
      user_id,
      "with recipe_id:",
      recipe_id
    ); // Debugging
    console.log("Datos recibidos en el body:", req.body); // Debugging
    if (!recipe_id) {
      return res.status(400).json({ message: "Recipe ID is missing." });
    }

    const existingFavorite = await Favorite.findOne({
      where: { user_id, recipe_id },
    });
    if (existingFavorite) {
      console.log("Recipe is already in favorites."); // Debugging
      return res
        .status(400)
        .json({ message: "Recipe is already in favorites." });
    }

    const favorite = await Favorite.create({ user_id, recipe_id });
    console.log("Favorite added successfully:", favorite); // Debugging
    return res.status(201).json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).json({ message: "Error adding favorite." });
  }
};

// Eliminar un favorito
/*export const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await Favorite.destroy({ where: { id } });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found." });
    }

    return res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return res.status(500).json({ message: "Error deleting favorite." });
  }
};*/
// Eliminar un favorito
// Eliminar un favorito basado en user_id y recipe_id
export const deleteFavorite = async (req, res) => {
  try {
    const user_id = req.user.id_user;
    const { id } = req.params; // Este `id` es el `recipe_id` de la receta

    console.log(
      "Deleting favorite for user_id:",
      user_id,
      "with recipe_id:",
      id
    );

    const favorite = await Favorite.findOne({
      where: { user_id, recipe_id: id },
    });

    if (!favorite) {
      console.log("Favorite not found for user."); // Debugging
      return res.status(404).json({ message: "Favorite not found." });
    }

    await favorite.destroy();
    console.log("Favorite removed successfully."); // Debugging
    return res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return res.status(500).json({ message: "Error deleting favorite." });
  }
};


// favoriteController.js
export const getTop3Favorites = async (req, res) => {
  try {
    const userId = req.user.id_user; // Asegúrate de obtener el `id_user` del usuario autenticado

    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [{
        model: Recipe,
        attributes: [
          ['id_recipe', 'recipe_id'], // Alias para mantener la consistencia con el frontend
          'title',
          'description',
          'image',
          'preparation_time',
          'category' // Añadido para incluir la categoría en el resultado
        ]
      }],
      limit: 3,
      order: [['createdAt', 'DESC']]
    });

    // Extraemos las recetas favoritas de la respuesta
    const favoriteRecipes = favorites.map(fav => fav.Recipe);
    console.log("favoriteRecipes con alias:", favoriteRecipes);
    res.json({ data: favoriteRecipes });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las recetas favoritas', error });
  }
};
