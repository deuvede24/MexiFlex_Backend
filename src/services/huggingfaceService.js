import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

const generateRecipeWithHuggingFace = async (prompt) => {
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
};

export default generateRecipeWithHuggingFace;
