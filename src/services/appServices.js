// services/apiService.js
import axios from 'axios';
import {API_OPENAI_URL, API_KEY_OPENAI} from '@env'


export const getLoveTexts = async (category, limit = 50, page = 1) => {
  try {
    // Définir le prompt en fonction de la catégorie (poème, histoire, déclaration)
    let prompt = '';
    if (category === 'poem') {
      prompt = "Write a romantic love poem";
    } else if (category === 'story') {
      prompt = "Write a short romantic love story";
    } else if (category === 'declaration') {
      prompt = "Write a romantic love declaration";
    }

    // Appel API avec Axios
    const response = await axios.post(
      API_OPENAI_URL,
      {
        model: 'text-davinci-003',  // Modèle GPT de OpenAI
        prompt: prompt,
        max_tokens: 100,  // Ajustez selon le besoin
        temperature: 0.7,  // Valeur de créativité
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY_OPENAI}`,  // Ajout de la clé API
        },
      }
    );

    // Traiter la réponse
    const texts = response.data.choices.map(choice => choice.text);  // Récupère le texte généré
    return { success: true, data: texts };  // Retourner les textes générés

  } catch (error) {
    return { success: false, message: 'Erreur de connexion à l\'API' };
  }
};
