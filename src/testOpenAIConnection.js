import axios from "axios";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const openaiService = async () => {
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: "Generate a simple recipe with salt" }
        ],
        max_tokens: 100,
    }, {
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        }
    });
    
      
    console.log("Respuesta de OpenAI:", response.data);
  } catch (error) {
    console.error("Error al llamar a la API de OpenAI:", error);
  }
};

openaiService();
