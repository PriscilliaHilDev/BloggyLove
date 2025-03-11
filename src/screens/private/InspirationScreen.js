import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { getUserData } from '../../utils/userStorage';
import SearchInput from '../../components/SearchInput';
import { getLoveTexts } from '../../services/apiService'; // Import API

const InspirationScreen = ({ navigation }) => {
  const [userName, setUserName] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(5); // Nombre de posts visibles à chaque fois
  const [loadingMore, setLoadingMore] = useState(false); // Indicateur pour le chargement des posts supplémentaires

  // État d'animation pour la transition de fond
  const backgroundColor = new Animated.Value(0);

  // Récupérer le nom de l'utilisateur
  useEffect(() => {
    const getUser = async () => {
      const userData = await getUserData();
      if (userData) {
        setUserName(userData.user.name);
      }
    };
    getUser();
  }, []);

  // Récupérer les posts générés par l'API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await getLoveTexts(); // Appel sans paramètre
        if (response.success) {
          const data = response.data;
          let generatedPosts = [];
          Object.keys(data).forEach(category => {
            data[category].forEach((text, index) => {
              generatedPosts.push({
                id: `${category}-${index}`,
                category: category,
                content: text
              });
            });
          });
          setPosts(generatedPosts);
        } else {
          console.error('Erreur API:', response.message);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des posts :', error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Filtrer les publications
  const filteredPosts = selectedFilter === 'Tous' 
    ? posts.filter(post => post.content.trim() !== '') 
    : posts.filter(post => post.category === selectedFilter && post.content.trim() !== '');

  // Suggestions de recherche
  const allPostsContent = posts.map(post => post.content);
  const suggestions = allPostsContent.filter(content => content.toLowerCase().includes(search.toLowerCase()));

  // Animation de la couleur de fond
  useEffect(() => {
    Animated.timing(backgroundColor, {
      toValue: search ? 1 : 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [search]);

  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f7f7f7', '#f0f0f0']
  });

  const loadMorePosts = async () => {
    if (loadingMore || visiblePosts >= filteredPosts.length) return; // Eviter de charger plusieurs fois en même temps ou si tout est déjà chargé
    setLoadingMore(true);
    setVisiblePosts((prev) => Math.min(prev + 5, filteredPosts.length)); // Augmenter le nombre de posts visibles
    setLoadingMore(false);
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedBackgroundColor }]}>
      {/* Barre de recherche */}
      <SearchInput searchValue={search} onSearchChange={setSearch} suggestions={suggestions} />

      {/* Affichage du chargement */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff7f50" style={styles.loader} />
      ) : (
        <>
          {/* Filtres */}
          <View style={styles.filterContainer}>
            {['Tous', 'Poème', 'Déclaration', 'Histoire'].map((name) => (
              <TouchableOpacity
                key={name}
                style={[styles.filterButton, selectedFilter === name && styles.activeFilter]}
                onPress={() => setSelectedFilter(name)}
              >
                <Text style={[styles.filterText, selectedFilter === name && styles.activeFilterText]}>
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Liste des publications */}
          <FlatList
            data={filteredPosts.slice(0, visiblePosts)} // Affiche seulement les posts visibles
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Text style={styles.postCategory}>{item.category}</Text>
                <Text style={styles.postContent}>{item.content}</Text>
              </View>
            )}
            onEndReached={loadMorePosts} // Charge plus de posts quand on atteint la fin
            onEndReachedThreshold={0.1} // Déclenche l'appel quand on est à 10% de la fin
            ListFooterComponent={loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#ff7f50" />
              </View>
            ) : null}
          />
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  activeFilter: {
    backgroundColor: '#ff7f50',
    borderColor: '#ff7f50'
  },
  filterText: {
    color: '#333'
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2
  },
  postCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff7f50',
    marginBottom: 5
  },
  postContent: {
    fontSize: 16,
    color: '#333'
  },
  footerLoader: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default InspirationScreen;
