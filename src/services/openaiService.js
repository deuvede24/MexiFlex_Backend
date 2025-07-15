/*import axios from 'axios';

const openaiService = async (prompt) => {
  try {
    console.log('Clave API:', process.env.OPENAI_API_KEY);
    console.log('Realizando solicitud a OpenAI con el prompt:', prompt);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log('Respuesta de OpenAI:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error al llamar a la API de OpenAI:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default openaiService;*/

// src/services/openaiService.js
import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function generateRecipeWithOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no configurada en .env');
  }

  console.log('🔄 Llamando a ChatCompletion con max_tokens=150…');
  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Eres un experto chef mexicano.' },
        { role: 'user',   content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const text = resp.choices?.[0]?.message?.content.trim();
    if (!text) {
      console.error('❌ OpenAI devolvió formato inesperado:', resp);
      throw new Error('No se obtuvo texto de OpenAI');
    }

    console.log('✅ Texto recibido de OpenAI (chat)');
    return text;

  } catch (err) {
    console.error('❌ Error OpenAI (chat):', err);
    throw new Error(`OpenAI falló: ${err.message}`);
  }
}


