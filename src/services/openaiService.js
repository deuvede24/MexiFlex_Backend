import axios from 'axios';




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

export default openaiService;
