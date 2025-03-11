// services/apiService.js
import axios from 'axios';
import { API_KEY_OPENAI, API_OPENAI_URL } from '@env';


export const getLoveTexts = async (category) => {
  try {
    console.log(`Demande de texte pour la catégorie : ${category}`);

    const response = await axios.post(
      API_OPENAI_URL,
      {
        model: "gpt-4o",
        messages: [{ role: 'system', content: `Génère un texte d'amour (${category})` }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY_OPENAI}`,
        },
      }
    );

    console.log('Réponse API:', response.data);

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('Réponse invalide de l’API');
    }

    const generatedText = response.data.choices[0].text.trim();
    return { success: true, data: generatedText };

  } catch (error) {
    console.error('Erreur lors de la génération du texte :', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.error?.message || 'Erreur inconnue' };
  }
};

