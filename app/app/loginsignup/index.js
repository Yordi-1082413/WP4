import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './styles';

const LoginSignup = () => {

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await fetch (`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.statusText}`);
      }

      router.push('/home');
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
      console.log(data);

      router.push('/profile');
      
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
        <View style={styles.underline} />
      </View>
      <View style={styles.inputs}>
        {isSignUp && (
          <View style={styles.input}>
            <FontAwesomeIcon style={styles.icon} icon={faUser} />
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.inputField}
              placeholderTextColor="#B3B3B3"
            />
          </View>
        )}
        <View style={styles.input}>
          <FontAwesomeIcon style={styles.icon} icon={faEnvelope} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.inputField}
            placeholderTextColor="#B3B3B3"
          />
        </View>
        <View style={styles.input}>
          <FontAwesomeIcon style={styles.icon} icon={faLock} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
            placeholderTextColor="#B3B3B3"
          />
        </View>
      </View>
      {!isSignUp && (
        <Pressable style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>
            Lost Password? <Text style={styles.clickHere}>Click Here!</Text>
          </Text>
        </Pressable>
      )}
      <View style={styles.submitContainer}>
        {!isSignUp && (
          <Pressable style={styles.gray} onPress={() => setIsSignUp(true)}>
            <Text style={styles.grayText}>New here? Sign Up</Text>
          </Pressable>
        )}
        {isSignUp && (
          <Pressable style={styles.gray} onPress={() => setIsSignUp(false)}>
            <Text style={styles.grayText}>Login instead</Text>
          </Pressable>
        )}
        <Pressable style={styles.submit} onPress={isSignUp ? handleSignup : handleLogin}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginSignup;