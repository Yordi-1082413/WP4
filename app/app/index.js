import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Link, useRouter, Router } from 'expo-router';
import styles from './styles';
import landingpageimg from '../assets/glitchnessie.png'

const Landing = ({ navigation }) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const router = useRouter();
  const floatingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnimation, {
          toValue: -15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch(`${API_URL}/auth/check-session`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.redirect) {
        router.push('/profile');
        console.log("User logged in, redirecting to /profile")
      }
    };

    checkSession();
  }, []);


  return (

    <View style={styles.container}>    

      <View style={styles.columnleft}>
        <Animated.Image
          source={landingpageimg}
          style={[
            styles.image,
            {
              transform: [{ translateY: floatingAnimation }],
            },
          ]}
        />
      </View>
      <View style={styles.columnright}>
        <Text style={styles.header}>Welkom bij <Text style={styles.headerSpan}>Glitch!</Text></Text>
        <Text style={styles.text}>Klik op de knop hierbeneden om in te loggen!</Text>
        <Pressable style={styles.loginsignupbutton}>
          <Link href="/loginsignup">
            <Text style={{ color: '#fff' }}>Inloggen</Text>
          </Link>
        </Pressable>
      </View>
    </View>

  );
}
export default Landing;
