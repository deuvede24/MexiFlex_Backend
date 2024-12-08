import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

const generateRecipeWithHuggingFace = async (prompt) => {
  try {
    console.log("Starting Hugging Face generation...");
    console.log("API Key:", process.env.HUGGING_FACE_API_KEY ? "Key exists" : "No key found");
    console.log("Environment:", process.env.NODE_ENV);
    
    if (!process.env.HUGGING_FACE_API_KEY) {
      throw new Error("Hugging Face API key not found");
    }

    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    console.log("HF Instance created");

    const response = await hf.textGeneration({
      model: 'facebook/opt-350m',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        repetition_penalty: 1.2
      }
    });
    console.log("Generation response received");
    return response.generated_text;
  } catch (error) {
    console.error("Detailed Hugging Face error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

export default generateRecipeWithHuggingFace;

