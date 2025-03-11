// services/apiService.js
import {API_BASE_URL} from '@env';
import api from '../secureApiRequest';

export const getAllPosts = async (page = 1, limit = 5) => {
  try {
    const response = await api.get(`${API_BASE_URL}/posts`, {
      params: { page, limit }  // Ajout des paramètres de pagination à la requête
    });
    console.log("Réponse complète de l'API :", response);  // Vérifie toute la réponse

    if (response.data.success) {
      const posts = response.data.data;
      console.log(posts, 'posts');
      const totalPages = response.data.totalPages;
      const currentPage = response.data.currentPage;

      // Retourner aussi les informations de pagination
      return { success: true, data: posts, totalPages, currentPage };
    } else {
      console.log("Erreur API: ", response.data.message);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des textes:', error);
    return { success: false, message: error.message || "Erreur de connexion à l'API" };
  }
};


// export const getAllPosts = async () => {
//     try {
//       const response = await api.get(`${API_BASE_URL}/posts`);
//       console.log("Réponse complète de l'API :", response);  // Vérifiez toute la réponse
//       if (response.data.success) {
//         return { success: true, data: response.data.data };
//       } else {
//         console.log("Erreur API: ", response.data.message);  // Affichez le message d'erreur s'il y en a
//         return { success: false, message: response.data.message };
//       }
//     } catch (error) {
//       console.error('Erreur lors de la récupération des textes:', error);
//       return { success: false, message: error.message || "Erreur de connexion à l'API" };
//     }
//   };
  

  // export const getAllPosts = async (page = 1, limit = 5) => {
  //   try {
  //     const response = await api.get(`${API_BASE_URL}/posts`, {
  //       params: { page, limit },  // Paramètres de pagination
  //     });
      
  //     console.log("Réponse complète de l'API :", response.data);  // Vérifiez toute la réponse
  
  //     if (response.data.success) {
  //       return {
  //         success: true,
  //         data: response.data.data,  // Données des posts
  //         totalPages: response.data.totalPages,  // Nombre total de pages
  //         currentPage: response.data.currentPage,  // Page actuelle
  //       };
  //     } else {
  //       console.log("Erreur API: ", response.data.message);  // Affichez le message d'erreur
  //       return { success: false, message: response.data.message };
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des posts:', error);
  //     return { success: false, message: error.message || "Erreur de connexion à l'API" };
  //   }
  // };