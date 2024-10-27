import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import Recipe from "./models/recipeModel.js";
import RecipeIngredient from "./models/recipeIngredientModel.js";
import MapLocation from "./models/mapModel.js";
import Event from "./models/eventModel.js";

const insertInitialData = async () => {
  try {
    // Usuarios iniciales
    const hashedPassword = await bcrypt.hash(
      "password123",
      parseInt(process.BCRYPT_SALT)
    );
    const userData = [
      {
        email: "dani@example.com",
        password: hashedPassword,
        username: "dani",
        avatar: null,
      },
      {
        email: "user@example.com",
        password: hashedPassword,
        username: "user",
        avatar: null,
      },
      {
        email: "carolina@gmail.com",
        password: hashedPassword,
        username: "carol",
        avatar: null,
      },
      {
        email: "dogbark@gmail.com",
        password: hashedPassword,
        username: "dog",
        avatar: null,
      },
    ];


    await Promise.all(
      userData.map((user) =>
        User.upsert({
          email: user.email,
          password: user.password,
          username: user.username,
          avatar: user.avatar,
        })
      )
    );
    console.log("Usuarios insertados o actualizados correctamente.");

    // Recetas con ingredientes completos
    const recipeData = [
      {
        id_recipe: 1,
        title: "Tacos de Picadillo",
        description: "Tacos tradicionales con carne molida",
        serving_size: 1,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos-de-picadillo.jpeg",
        category: "tradicional",
        steps:
          "1. Dorar la carne molida de ternera con cebolla y ajo.\n2. Añadir tomate y cilantro.",
      },
      {
        id_recipe: 2,
        title: "Tacos de Picadillo",
        description: "Tacos de picadillo con Picada de Heura",
        serving_size: 1,
        preparation_time: 45,
        is_premium: 0,
        image: "tacos-de-picadillo.jpeg",
        category: "flexi",
        steps:
          "1. Dorar la carne de Heura con cebolla y ajo.\n2. Añadir tomate y cilantro.",
      },
      {
        id_recipe: 3,
        title: "Flautas de Pollo",
        description: "Flautas tradicionales con pollo",
        serving_size: 1,
        preparation_time: 60,
        is_premium: 0,
        image: "flautas-depollo.jpg",
        category: "tradicional",
        steps:
          "1. Cocinar la pechuga de pollo y desmenuzarla.\n2. Rellenar las tortillas con el pollo y freírlas.",
      },
      {
        id_recipe: 4,
        title: "Flautas de Pollo",
        description: "Flautas con tofu.",
        serving_size: 1,
        preparation_time: 60,
        is_premium: 0,
        image: "flautas-depollo.jpg",
        category: "flexi",
        steps:
          "1. Rallar el tofu, sazonarlo y cocinarlo.\n2. Rellenar las tortillas con el tofu y freírlas.",
      },
      {
        id_recipe: 5,
        title: "Tacos de Chicharrón",
        description: "Tacos con chicharrón prensado.",
        serving_size: 1,
        preparation_time: 40,
        is_premium: 0,
        image: "tacos-de-chicharron.jpg",
        category: "tradicional",
        steps:
          "1. Cocinar el chicharrón prensado.\n2. Colocar el chicharrón en las tortillas de maíz.",
      },
      {
        id_recipe: 6,
        title: "Tacos de Chicharrón",
        description: "Tacos de chicharrón de tofu crujiente",
        serving_size: 2,
        preparation_time: 30,
        is_premium: 0,
        image: "tacos-de-chicharron.jpg",
        category: "flexi",
        steps:
          "1. Marinar el tofu con salsa de soja, ajo y aceite.\n2. Cocinar el tofu marinado en la air fryer.",
      },
    ];

    // Insertar o actualizar recetas e ingredientes
    for (const recipe of recipeData) {
      const [newRecipe] = await Recipe.upsert({
        id_recipe: recipe.id_recipe,
        title: recipe.title,
        description: recipe.description,
        serving_size: recipe.serving_size,
        preparation_time: recipe.preparation_time,
        is_premium: recipe.is_premium,
        image: recipe.image,
        category: recipe.category,
        steps: recipe.steps,
      });

      // Ingredientes según la receta
      const ingredientData = [];

      if (recipe.id_recipe === 1) {
        ingredientData.push(
          {
            ingredient_name: "Carne molida de ternera",
            quantity: "125 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cebolla",
            quantity: "1/2 unidad",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Ajo",
            quantity: "2 dientes",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tomate",
            quantity: "1 unidad",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cilantro",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "4 unidades",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 2) {
        ingredientData.push(
          {
            ingredient_name: "Picada de Heura",
            quantity: "150 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cebolla",
            quantity: "1/2 unidad",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Ajo",
            quantity: "2 dientes",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tomate",
            quantity: "1 unidad",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cilantro",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "4 unidades",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 3) {
        ingredientData.push(
          {
            ingredient_name: "Pechuga de pollo",
            quantity: "200 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "6 unidades",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Aceite",
            quantity: "Para freír",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Lechuga",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Crema",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 4) {
        ingredientData.push(
          {
            ingredient_name: "Tofu rallado",
            quantity: "200 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "6 unidades",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Aceite",
            quantity: "Para freír",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Lechuga",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Crema vegana",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 5) {
        ingredientData.push(
          {
            ingredient_name: "Chicharrón prensado",
            quantity: "150 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "4 unidades",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Salsa verde",
            quantity: "Al gusto",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Cebolla",
            quantity: "1/2 unidad",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      if (recipe.id_recipe === 6) {
        ingredientData.push(
          {
            ingredient_name: "Chicharrón de Tofu crujiente",
            quantity: "200 g",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Salsa de soja",
            quantity: "2 cucharadas",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Ajo",
            quantity: "2 dientes",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Aceite de oliva",
            quantity: "2 cucharadas",
            recipe_id: newRecipe.id_recipe,
          },
          {
            ingredient_name: "Tortillas de maíz",
            quantity: "4 unidades",
            recipe_id: newRecipe.id_recipe,
          }
        );
      }

      // Insertar o actualizar ingredientes
      /*  for (const ingredient of ingredientData) {
        await RecipeIngredient.upsert({
          recipe_id: ingredient.recipe_id,
          ingredient_name: ingredient.ingredient_name,
          quantity: ingredient.quantity,
        });
      }
    }*/ // Insertar ingredientes sin duplicarlos
      for (const ingredient of ingredientData) {
        const [ingredientRecord] = await RecipeIngredient.findOrCreate({
          where: {
            recipe_id: ingredient.recipe_id,
            ingredient_name: ingredient.ingredient_name,
          },
          defaults: { quantity: ingredient.quantity },
        });

        if (ingredientRecord) {
          console.log(
            `Ingrediente '${ingredient.ingredient_name}' insertado o actualizado correctamente.`
          );
        }
      }
    }

    // Insertar o actualizar ubicaciones de mapa
    const mapLocationData = [
      {
        id: 1,
        name: "Restaurante Vegano Central",
        description: "Restaurante de comida vegana en el centro de la ciudad",
        latitude: 40.416775,
        longitude: -3.70379,
        category: "Restaurante",
      },
      {
        id: 2,
        name: "Mercado de Tacos",
        description: "Mercado con los mejores tacos de la ciudad",
        latitude: 19.432608,
        longitude: -99.133209,
        category: "Mercado",
      },
    ];

    for (const location of mapLocationData) {
      await MapLocation.upsert({
        id: location.id,
        name: location.name,
        description: location.description,
        latitude: location.latitude,
        longitude: location.longitude,
        category: location.category,
      });
    }

    // Insertar o actualizar eventos
    const eventData = [
      {
        id: 1,
        title: "Festival de Tacos",
        description: "Un festival para probar diferentes tacos",
        type: "restaurante",
        date: new Date(),
      },
      {
        id: 2,
        title: "Feria Vegana",
        description: "Una feria con comida vegana",
        type: "feria",
        date: new Date(),
      },
    ];

    for (const event of eventData) {
      await Event.upsert({
        id: event.id,
        title: event.title,
        description: event.description,
        type: event.type,
        date: event.date,
      });
    }

    console.log("Datos insertados o actualizados correctamente.");
  } catch (error) {
    console.error("Error al insertar datos iniciales:", error);
  }
};

export default insertInitialData;
