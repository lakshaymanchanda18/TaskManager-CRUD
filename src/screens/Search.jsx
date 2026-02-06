// src/screens/Search.jsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Search = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Search Screen
      </Text>

      {/* Pops one screen from stack */}
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});