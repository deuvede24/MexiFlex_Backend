import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

const generateRecipeWithHuggingFace = async (prompt) => {
  try {
    const response = await hf.textGeneration({
      model: 'EleutherAI/gpt-neo-2.7B',
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
      },
    });
    return response.generated_text;
  } catch (error) {
    console.error("Error al llamar a la API de Hugging Face:", error);
    throw error;
  }
};

export default generateRecipeWithHuggingFace;
