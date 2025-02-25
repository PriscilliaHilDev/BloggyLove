import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserData } from '../../utils/userStorage';

const FluxScreen = ({ navigation }) => {
  const [userName, setUserName] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  
  // Faux contenu de publications
  const posts = [
    { id: '1', category: 'Poème', content: 'Roses are red, violets are blue, Lorem ipsum dolor sit amet.' },
    { id: '2', category: 'Déclaration', content: 'Je t’aime plus que tout, et chaque instant est magique avec toi.' },
    { id: '3', category: 'Histoire', content: 'Il était une fois une rencontre qui changea tout...' },
    { id: '4', category: 'Poème', content: 'Dans tes yeux, je vois un océan d’étoiles.' },
    { id: '5', category: 'Déclaration', content: 'Tu es mon univers, mon inspiration et ma raison de sourire.' }
  ];

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

  // Filtrer les publications
  const filteredPosts = selectedFilter === 'Tous' ? posts : posts.filter(post => post.category === selectedFilter);

  return (
    <View style={styles.container}>
     

      {/* Barre de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {/* Filtres */}
      <View style={styles.filterContainer}>
        {['Tous', 'Poème', 'Déclaration', 'Histoire'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedFilter === filter && styles.activeFilter]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des publications */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postCategory}>{item.category}</Text>
            <Text style={styles.postContent}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
    paddingTop: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  drawerButton: {
    padding: 10
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10
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
  }
});

export default FluxScreen;
