import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getUserData } from '../../utils/userStorage';
import SearchInput from '../../components/SearchInput';
import { getAllPosts } from '../../services/postService';

const FluxScreen = ({ navigation }) => {
  const [userName, setUserName] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getUser = async () => {
      const userData = await getUserData();
      if (userData) {
        setUserName(userData.user.name);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchPosts(1, true);  // Récupérer les posts à la première ouverture
  }, []);

  const fetchPosts = async (pageNum = 1, reset = false) => {
    if (loading || (pageNum > 1 && pageNum > totalPages)) return;
    setLoading(true);
    try {
      const response = await getAllPosts(pageNum);
      if (response.success) {
        setPosts((prevPosts) => (reset ? response.data : [...prevPosts, ...response.data]));
        setTotalPages(response.totalPages);
        setPage(response.currentPage);
      } else {
        console.error('Erreur API:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des posts :', error);
    }
    setLoading(false);
  };

  // Filtrer les posts en fonction de la catégorie sélectionnée et de la recherche
  const filteredPosts = posts.filter(post => {
    const isCategoryMatch =
      selectedFilter === 'Tous' ||
      (post.categoryId && post.categoryId.name === selectedFilter); // Vérification que categoryId existe et est un objet avec une propriété 'name'
    
    // Vérification si post.content existe avant de tenter de l'utiliser
    const isSearchMatch = post.content && post.content.toLowerCase().includes(search.toLowerCase());
  
    return isCategoryMatch && isSearchMatch;
  });

  const availableFilters = ['Tous', 'Poème', 'Déclaration', 'Histoire'].map(filter => ({
    name: filter,
    disabled: filter !== 'Tous' && posts.filter(post => post.categoryId && post.categoryId.name === filter).length === 0  // Vérification de la catégorie
  }));

  // Optimisation de la liste de posts pour éviter des rendus inutiles
  const PostItem = React.memo(({ item }) => {
    // Vérification que categoryId existe et est un objet avec une propriété 'name'
    const categories = item.categoryId && item.categoryId.name ? item.categoryId.name : 'Aucune catégorie';
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postCategory}>{categories}</Text>
        <Text style={styles.postContent}>{item.content}</Text>
      </View>
    );
  });

  // Utilisation de useCallback pour éviter de recréer la fonction de rendu de chaque item
  const renderItem = useCallback(({ item }) => <PostItem item={item} />, []);

  return (
    <View style={styles.container}>
      <SearchInput searchValue={search} onSearchChange={setSearch} />
      <View style={styles.filterContainer}>
        {availableFilters.map(({ name, disabled }) => (
          <TouchableOpacity
            key={name}
            style={[styles.filterButton, selectedFilter === name && styles.activeFilter, disabled && styles.disabledFilter]}
            onPress={() => !disabled && setSelectedFilter(name)}
            disabled={disabled}
          >
            <Text style={[styles.filterText, selectedFilter === name && styles.activeFilterText, disabled && styles.disabledFilterText]}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderItem} // Utilisation de renderItem optimisé avec useCallback
        onEndReached={() => fetchPosts(page + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="small" color="#ff7f50" />}
        initialNumToRender={10} // Nombre d'éléments à rendre initialement
        maxToRenderPerBatch={10} // Nombre d'éléments à rendre par lot
        windowSize={21} // Taille de la fenêtre de rendu
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20
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
  disabledFilter: {
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0'
  },
  disabledFilterText: {
    color: '#aaa'
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
  }
});

export default FluxScreen;
