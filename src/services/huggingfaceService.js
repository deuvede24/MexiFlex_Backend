import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

/*const generateRecipeWithHuggingFace = async (prompt) => {
  try {
    const response = await hf.textGeneration({
      model: 'facebook/opt-350m',  // Cambiamos a un modelo más estable y gratuito
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,      // Ajustado al límite gratuito
        temperature: 0.7,         // Balance entre creatividad y consistencia
        repetition_penalty: 1.2   // Evitar repeticiones manteniendo coherencia
      }
    });
    return response.generated_text;
  } catch (error) {
    console.error("Error con Hugging Face:", error);
    throw error;
  }
};*/
const generateRecipeWithHuggingFace = async (prompt) => {
  try {
    console.log("Starting Hugging Face generation...");
    console.log("API Key present:", !!process.env.HUGGING_FACE_API_KEY);
    
    const response = await hf.textGeneration({
      model: 'facebook/opt-350m',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        repetition_penalty: 1.2
      }
    });
    console.log("Generation successful");
    return response.generated_text;
  } catch (error) {
    console.error("Error detallado de Hugging Face:", {
      message: error.message,
      status: error.status,
      type: error.type
    });
    throw error;
  }
};

export default generateRecipeWithHuggingFace;
//
