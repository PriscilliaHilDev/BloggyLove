// services/apiService.js
import {API_BASE_URL} from '@env';
import api from '../secureApiRequest';


export const getLoveTexts = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/love-texts`);
        if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des textes :', error);
      return { success: false, message: "Erreur de connexion à l'API" };
    }
  };