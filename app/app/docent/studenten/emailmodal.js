import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const ModalComponent = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const EMAIL_REGEX = /^[^@]+@hr\.nl$/;

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const validateEmails = (emails) => {
    const emailList = emails.split(',').map(email => email.trim());
    const invalidEmails = emailList.filter(email => !EMAIL_REGEX.test(email));
    return invalidEmails;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const invalidEmails = validateEmails(email);

    if (invalidEmails.length > 0) {
      setError(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/docent/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      alert('Invite sent successfully');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setEmail('');
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Invite Student</Text>
          <TextInput
            style={[styles.input, { color: '#fff' }]}
            placeholder="Enter email(s)"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={handleEmailChange}
          />
          {loading && <ActivityIndicator size="small" color="#fff" />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#a336c1' }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#555' }]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    padding: 24,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ModalComponent;