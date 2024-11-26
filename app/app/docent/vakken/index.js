import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Layout from '../layout';

export default function Vakken() {
  const [vakken, setVakken] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchVakken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/docent/getallsubjects`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Geen vakken gevonden');
        }

        const data = await response.json();
        setVakken(data.map((item, index) => ({
          id: item[0],
          name: item[1],
          description: item[2],
          key: `${item[0]}-${index}`,
          imageUrl: `https://picsum.photos/seed/${item[0]}/200/200` // Using seed based on vak ID for consistent random images imageUrl :)
        })));
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVakken();
  }, []);

  if (loading) {
    return (
      <Layout>
        <ActivityIndicator size="large" color="#a336c1" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Text style={styles.errorText}>Error: {error}</Text>
      </Layout>
    );
  }

  const handleVakPress = (vakid) => {
    router.push(`/docent/vakken/inleveringen?vakid=${vakid}`);
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Vakken Overzicht</Text>
        <FlatList
          data={vakken}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleVakPress(item.id)}>
              <View style={styles.item}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#181818',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  listContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  description: {
    fontSize: 14,
    color: 'gray',
    flexShrink: 1,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
  },
});
