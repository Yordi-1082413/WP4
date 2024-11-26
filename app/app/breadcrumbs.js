import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

const Breadcrumbs = () => {
  const router = useRouter();
  const segments = useSegments();

  const handleBreadcrumbPress = (index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    router.push(path);
  };

  return (
    <View style={styles.container}>
      {segments.map((value, index) => {
        const isLast = index === segments.length - 1;
        return (
          <View key={index} style={styles.breadcrumbItem}>
            <TouchableOpacity
              onPress={() => handleBreadcrumbPress(index)}
              disabled={isLast}
            >
              <Text style={isLast ? styles.textLast : styles.text}>
                {value}
              </Text>
            </TouchableOpacity>
            {!isLast && <Text style={styles.separator}> / </Text>}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: 'rgb(24, 24, 24)',
    },
    breadcrumbItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: '#a336c1',
    },
    textLast: {
      color: '#fff',
    },
    separator: {
      marginHorizontal: 5,
      color: '#ccc',
    },
  });

export default Breadcrumbs;
