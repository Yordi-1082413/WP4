import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Layout from './layout';

const DocentPage = () => {
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.message}>
            Hallo Docent, de docentenpagina is alleen bedoeld voor webbrowsers. Gebruik een computer om deze pagina te openen.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.message}>
            Welkom docent bij de docenten dashboard, je kan hier links navigeren naar de vakken en de studenten.
          </Text>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#181818',
  },
  card: {
    backgroundColor: '#282828',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 10,
  },
});

export default DocentPage;
