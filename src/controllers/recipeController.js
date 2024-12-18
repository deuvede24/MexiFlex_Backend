import Recipe from "../models/recipeModel.js";
import RecipeIngredient from "../models/recipeIngredientModel.js";
import { validationResult } from "express-validator";
import openaiService from "../services/openaiService.js";
import generateRecipeWithHuggingFace from "../services/huggingfaceService.js";


export const generateRecipeWithAI = async (req, res) => {
  try {
    console.log("Starting recipe generation...");
    console.log("Request body:", req.body);
    const { ingredients, recipeType } = req.body;

    // Validación mejorada
    if (!ingredients || !recipeType) {
      return res.status(400).json({
        code: -1,
        message: "Faltan ingredientes o tipo de receta",
      });
    }

    // Prompt más conciso y directo
    const prompt = `Genera una receta mexicana de ${recipeType}:

Ingredientes disponibles:
- Proteínas: ${ingredients.proteins.join(", ")}
- Vegetales: ${ingredients.vegetables.join(", ")}
- Carbohidratos: ${ingredients.carbs.join(", ")}
- Grasas: ${ingredients.fats.join(", ")}

Formato requerido:
TITULO: [nombre creativo]

INGREDIENTES:
- [cantidad] de [ingrediente]
...

PASOS:
1. Preparar la proteína
2. Preparar vegetales
3. Preparar carbohidratos
4. Montar platillo
5. Servir y decorar`;

    const generatedRecipeText = await generateRecipeWithHuggingFace(prompt);
    const steps = [
      `Preparar ${ingredients.proteins.join(
        " y "
      )}: cocinar hasta el punto deseado`,
      `Preparar ${ingredients.vegetables.join(
        ", "
      )}: lavar, desinfectar y cortar`,
      `Preparar ${ingredients.carbs.join(
        " y "
      )}: calentar/preparar según instrucciones`,
      "Montar el platillo",
      `Servir con ${ingredients.fats.join(" y ")} y decorar`,
    ];

    // Parsing más robusto
    const parsedRecipe = {
      // Si no hay título o es [nombre creativo], generamos uno significativo
      title: generatedRecipeText
        .match(/TITULO:\s*(.*)/)?.[1]
        ?.includes("[nombre creativo]")
        ? `${ingredients.proteins.join(" y ")} ${recipeType}` // Por ejemplo: "Pollo y Frijoles Tacos"
        : generatedRecipeText.match(/TITULO:\s*(.*)/)?.[1] ||
          `${recipeType} Mexicano con ${ingredients.proteins.join(" y ")}`, // Último fallback
      description: `${recipeType} mexicano usando ${Object.values(ingredients)
        .flat()
        .join(", ")}`,
      category: recipeType,
      is_premium: false,
      serving_size: 4,
      preparation_time: 30,
      RecipeIngredients: [
        ...ingredients.proteins.map((p) => ({
          ingredient_name: p,
          quantity: "300g",
        })),
        ...ingredients.vegetables.map((v) => ({
          ingredient_name: v,
          quantity: "2 piezas",
        })),
        ...ingredients.carbs.map((c) => ({
          ingredient_name: c,
          quantity: "4 piezas",
        })),
        ...ingredients.fats.map((f) => ({
          ingredient_name: f,
          quantity: "2 cucharadas",
        })),
      ],
      steps: steps, // Usamos los pasos específicos
    };

    res.status(200).json({
      code: 1,
      message: "Recipe generated successfully",
      data: parsedRecipe,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: -100,
      message: "Error al generar la receta con IA",
      error: error.message,
    });
  }
};

/*export const generateRecipeWithAI = async (req, res) => {
  try {
    const { ingredients, recipeType, preference } = req.body;

    // Prompt más estructurado y claro
    const prompt = `
Genera una receta mexicana de ${recipeType} usando estos ingredientes: ${ingredients.join(", ")}.
Estilo: ${preference}

La receta debe seguir este formato exacto:

TITULO: [Nombre de la receta]
DESCRIPCION: [Breve descripción]
INGREDIENTES:
- [ingrediente 1 con cantidad]
- [ingrediente 2 con cantidad]
- [etc...]
PASOS:
1. [primer paso]
2. [segundo paso]
3. [etc...]

La receta debe ser detallada y en español.
`;

    const generatedRecipeText = await generateRecipeWithHuggingFace(prompt);

    // Parseo más robusto de la respuesta
    const recipeStructure = parseRecipeText(generatedRecipeText);

    const generatedRecipe = {
      title: recipeStructure.title || `Receta de ${recipeType}`,
      description: recipeStructure.description || "Receta mexicana generada con IA",
      category: recipeType,
      steps: recipeStructure.steps,
      is_premium: false,
      serving_size: 4,
      preparation_time: 30,
      ingredients: recipeStructure.ingredients.map(ing => ({
        ingredient_name: ing.name,
        quantity: ing.quantity || "Al gusto"
      }))
    };

    res.status(200).json({
      code: 1,
      message: "Recipe generated successfully",
      data: generatedRecipe
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: -100,
      message: "Error al generar la receta con IA"
    });
  }
};

// Función auxiliar para parsear el texto de la receta
const parseRecipeText = (text) => {
  const sections = text.split('\n').map(line => line.trim());
  let currentSection = '';
  const recipe = {
    title: '',
    description: '',
    ingredients: [],
    steps: []
  };

  sections.forEach(line => {
    if (line.startsWith('TITULO:')) {
      recipe.title = line.replace('TITULO:', '').trim();
    } else if (line.startsWith('DESCRIPCION:')) {
      recipe.description = line.replace('DESCRIPCION:', '').trim();
    } else if (line.startsWith('INGREDIENTES:')) {
      currentSection = 'ingredients';
    } else if (line.startsWith('PASOS:')) {
      currentSection = 'steps';
    } else if (line.startsWith('-') && currentSection === 'ingredients') {
      const ingredient = line.replace('-', '').trim();
      // Intentar separar nombre y cantidad
      const parts = ingredient.split(',');
      recipe.ingredients.push({
        name: parts[0].trim(),
        quantity: parts[1]?.trim() || 'Al gusto'
      });
    } else if (line.match(/^\d+\./) && currentSection === 'steps') {
      recipe.steps.push(line.replace(/^\d+\./, '').trim());
    }
  });

  // Si no se obtuvieron pasos, devolver un mensaje por defecto
  if (recipe.steps.length === 0) {
    recipe.steps = ['Paso pendiente de generar'];
  }

  return recipe;
}*/

/*export const generateRecipeWithAI = async (req, res) => {
  try {
    const { ingredients, recipeType, preference } = req.body;

    const prompt = `
Genera una receta mexicana de ${recipeType} usando estos ingredientes principales: ${ingredients.join(", ")}.
Estilo: ${preference}

Por favor, sigue este formato exacto:
TITULO: [nombre de la receta en español]
INGREDIENTES:
- [ingrediente] - [cantidad]
PREPARACION:
1. [paso 1]
2. [paso 2]
3. [etc...]

La receta debe ser detallada y en español.
    `;

    console.log("Prompt enviado a Hugging Face:", prompt);
    const generatedRecipeText = await generateRecipeWithHuggingFace(prompt);

    // Parsear la respuesta
    const parsedRecipe = parseRecipeText(generatedRecipeText);

    const generatedRecipe = {
      title: parsedRecipe.title || `Receta de ${recipeType}`,
      description: `Receta mexicana de ${recipeType} estilo ${preference}`,
      category: recipeType,
      steps: parsedRecipe.steps,
      is_premium: false,
      serving_size: 4,
      preparation_time: 30,
      ingredients: parsedRecipe.ingredients
    };

    res.status(200).json({
      code: 1,
      message: "Recipe generated successfully",
      data: generatedRecipe
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: -100,
      message: "Error al generar la receta con IA"
    });
  }
};

const parseRecipeText = (text) => {
  const lines = text.split('\n').map(line => line.trim());
  const recipe = {
    title: '',
    ingredients: [],
    steps: []
  };

  let currentSection = '';

  lines.forEach(line => {
    if (line.startsWith('TITULO:')) {
      recipe.title = line.replace('TITULO:', '').trim();
    } else if (line.startsWith('INGREDIENTES:')) {
      currentSection = 'ingredients';
    } else if (line.startsWith('PREPARACION:')) {
      currentSection = 'steps';
    } else if (line.startsWith('-') && currentSection === 'ingredients') {
      const [name, quantity] = line.replace('-', '').split('-').map(s => s.trim());
      recipe.ingredients.push({
        ingredient_name: name,
        quantity: quantity || 'Al gusto'
      });
    } else if (line.match(/^\d+\./) && currentSection === 'steps') {
      recipe.steps.push(line.replace(/^\d+\./, '').trim());
    }
  });

  return recipe;
}*/

// Obtener todas las recetas (manejando guest para ver solo 5 recetas)
export const getRecipes = async (req, res) => {
  try {
    // Simplemente obtén todas las recetas sin considerar roles
    const recipes = await Recipe.findAll({
      include: RecipeIngredient, // Incluimos los ingredientes
      order: [["created_at", "DESC"]], // Las más recientes primero
    });

    res.status(200).json({
      code: 1,
      message: "Recipes List",
      data: recipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error fetching recipes",
    });
  }
};

/*export const generateRecipeWithAI = async (req, res) => {
  try {
    const { ingredients, recipeType, preference } = req.body;
 
    // Mejorar el prompt para resultados más consistentes
    const prompt = `
 Crea una receta mexicana detallada de ${recipeType}.
 Debe usar estos ingredientes principales: ${ingredients.join(", ")}.
 Estilo de cocina: ${preference} (${preference === 'tradicional' ? 'usar ingredientes tradicionales' : 'usar alternativas plant-based'})
 
 La receta debe seguir exactamente este formato:
 
 TITULO:
 [nombre descriptivo de la receta en español]
 
 INGREDIENTES:
 - [cantidad] de [ingrediente]
 [listar todos los ingredientes con sus cantidades]
 
 PASOS:
 1. [primer paso detallado]
 2. [segundo paso detallado]
 [etc...]
 
 La receta debe ser práctica, detallada y fácil de seguir.
    `;
 
    console.log("Prompt enviado a Hugging Face:", prompt);
    const generatedRecipeText = await generateRecipeWithHuggingFace(prompt);
 
    // Mejorar el parsing con validaciones
    const parsedRecipe = parseRecipeText(generatedRecipeText);
 
    const generatedRecipe = {
      title: parsedRecipe.title,
      description: `Receta mexicana de ${recipeType} estilo ${preference}`,
      category: recipeType,
      steps: parsedRecipe.steps.join('\n'),  // Convertir array a string para coincidir con tu modelo
      is_premium: false,
      serving_size: 4,
      preparation_time: 30,
      RecipeIngredients: parsedRecipe.ingredients  // Ya viene en el formato correcto
    };
 
    // Validaciones adicionales
    if (!generatedRecipe.title || generatedRecipe.title.trim() === '') {
      throw new Error('No se pudo generar un título válido');
    }
 
    if (!generatedRecipe.RecipeIngredients || generatedRecipe.RecipeIngredients.length === 0) {
      throw new Error('No se generaron ingredientes válidos');
    }
 
    if (!generatedRecipe.steps || generatedRecipe.steps.trim() === '') {
      throw new Error('No se generaron pasos válidos');
    }
 
    res.status(200).json({
      code: 1,
      message: "Recipe generated successfully",
      data: generatedRecipe
    });
 
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: -100,
      message: error.message || "Error al generar la receta con IA",
      error: error.toString()
    });
  }
 };*/

// Obtener receta por ID con ingredientes
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: RecipeIngredient, // Incluimos los ingredientes relacionados
    });

    if (!recipe) {
      return res.status(404).json({
        code: -3,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      code: 1,
      message: "Recipe retrieved successfully",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error retrieving recipe",
    });
  }
};

// Añadir una nueva receta con ingredientes
export const addRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size = 1,
      preparation_time = 0,
      //image,
      ingredients,
    } = req.body;

    console.log("Datos para crear la receta:", {
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
    });

    if (
      !title ||
      !description ||
      !category ||
      !steps ||
      is_premium === undefined ||
      !ingredients ||
      !serving_size ||
      preparation_time === undefined
    ) {
      return res.status(400).json({
        code: -2,
        message: "Missing required fields",
      });
    }

    // Si hay un archivo de imagen, guárdalo
    const imagePath = req.file ? req.file.filename : null;

    // Creamos la receta
    const newRecipe = await Recipe.create({
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      // image,
      image: imagePath, // Guardamos la ruta de la imagen
    });

    console.log("Receta creada con éxito:", newRecipe.id_recipe);

    // Crear los ingredientes relacionados
    const ingredientsToAdd = ingredients.map((ingredient) => ({
      recipe_id: newRecipe.id_recipe,
      ingredient_name: ingredient.ingredient_name,
      quantity: ingredient.quantity,
    }));

    console.log("Ingredientes a añadir:", ingredientsToAdd);
    await RecipeIngredient.bulkCreate(ingredientsToAdd);
    console.log("Ingredientes añadidos correctamente");

    res.status(200).json({
      code: 1,
      message: "Recipe added successfully",
      data: newRecipe,
    });
  } catch (error) {
    console.error("Error in addRecipe:", error);
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error adding recipe",
    });
  }
};

// Actualizar una receta existente con ingredientes
export const updateRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      console.log(`Receta no encontrada con ID: ${id}`);
      return res.status(404).json({
        code: -3,
        message: "Recipe not found",
      });
    }

    // Mostrar los datos recibidos en el body
    console.log("Datos recibidos en el body:", req.body);

    const {
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size = 1,
      preparation_time = 0,
      image,
      ingredients,
    } = req.body;

    // Mostrar los datos antes de actualizar la receta
    console.log("Datos antes de actualizar la receta:", {
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
      ingredients,
    });
    // Actualizamos los datos principales de la receta
    await recipe.update({
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
    });
    //////////////////////////

    // Actualizar ingredientes
    const currentIngredients = await RecipeIngredient.findAll({
      where: { recipe_id: id },
    });

    const currentIngredientMap = currentIngredients.reduce(
      (map, ingredient) => {
        map[ingredient.ingredient_name] = ingredient;
        return map;
      },
      {}
    );

    for (const ingredient of ingredients) {
      if (currentIngredientMap[ingredient.ingredient_name]) {
        const existingIngredient =
          currentIngredientMap[ingredient.ingredient_name];
        if (existingIngredient.quantity !== ingredient.quantity) {
          console.log(
            `Actualizando ingrediente: ${ingredient.ingredient_name} con cantidad: ${ingredient.quantity}`
          );
          await existingIngredient.update({ quantity: ingredient.quantity });
        }
        delete currentIngredientMap[ingredient.ingredient_name];
      } else {
        // Si el ingrediente no existe, crear uno nuevo
        console.log(
          `Creando nuevo ingrediente: ${ingredient.ingredient_name} con cantidad: ${ingredient.quantity}`
        );
        await RecipeIngredient.create({
          recipe_id: id,
          ingredient_name: ingredient.ingredient_name,
          quantity: ingredient.quantity,
        });
      }
    }

    const ingredientsToRemove = Object.values(currentIngredientMap);
    for (const ingredient of ingredientsToRemove) {
      console.log(`Eliminando ingrediente: ${ingredient.ingredient_name}`);
      await ingredient.destroy();
    }

    res.status(200).json({
      code: 1,
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error updating recipe",
    });
  }
};

// Actualizar parcialmente una receta
export const patchRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({
        code: -3,
        message: "Recipe not found",
      });
    }

    const {
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size = 1,
      preparation_time = 0,
      image,
    } = req.body;

    // Actualizar solo los campos proporcionados
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (steps !== undefined) updateData.steps = steps;
    if (is_premium !== undefined) updateData.is_premium = is_premium;
    if (serving_size !== undefined) updateData.serving_size = serving_size;
    if (preparation_time !== undefined)
      updateData.preparation_time = preparation_time;
    if (image !== undefined) updateData.image = image;

    await recipe.update(updateData);

    res.status(200).json({
      code: 1,
      message: "Recipe updated partially",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error partially updating recipe",
    });
  }
};

// Eliminar una receta junto con sus ingredientes
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    await RecipeIngredient.destroy({ where: { recipe_id: id } });
    const deletedRecipe = await Recipe.destroy({ where: { id_recipe: id } });

    if (!deletedRecipe) {
      return res.status(404).json({
        code: -100,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      code: 1,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error deleting recipe",
    });
  }
};

export const getSharedRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: RecipeIngredient,
    });

    if (!recipe) {
      return res.status(404).json({
        code: -3,
        message: "Recipe not found",
      });
    }

    // Si es una receta hardcodeada (21-24), devolver completa
    if (recipe.id_recipe >= 21 && recipe.id_recipe <= 24) {
      return res.status(200).json({
        code: 1,
        message: "Recipe retrieved successfully",
        data: recipe,
      });
    }

    // Para las demás, devolver vista previa
    return res.status(200).json({
      code: 1,
      message: "Recipe preview retrieved successfully",
      data: {
        id_recipe: recipe.id_recipe,
        title: recipe.title,
        image: recipe.image,
        description: recipe.description,
        preparation_time: recipe.preparation_time,
        serving_size: recipe.serving_size,
        RecipeIngredients: recipe.RecipeIngredients.slice(0, 3),
        category: recipe.category,
        isPreview: true
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error retrieving recipe",
    });
  }
};