import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';

const SearchInput = ({ searchValue, onSearchChange, suggestions }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher..."
        value={searchValue}
        onChangeText={onSearchChange}
      />

      {/* Suggestions de recherche */}
      {searchValue.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.length > 0 ? (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noResultsText}>Aucun résultat trouvé</Text> // Affiche ce message si pas de suggestions
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    width: '100%',  // Assurer que l'input prend toute la largeur
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45, // Pour que les suggestions apparaissent juste sous l'input
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    zIndex: 10,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  noResultsText: {
    padding: 10,
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SearchInput;
