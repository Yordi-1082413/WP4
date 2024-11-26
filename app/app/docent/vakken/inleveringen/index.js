import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Layout from '../../layout';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Inleveringen() {
  const { vakid } = useLocalSearchParams();
  const [inleveringen, setInleveringen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchInleveringen = async () => {
      try {
        if (!vakid) {
          throw new Error('Vak ID is undefined');
        }
        const response = await fetch(`${API_URL}/api/docent/getinleveringen/${vakid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 404) {
          throw new Error('Geen nieuwe inleveringen gevonden voor dit vak');
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setInleveringen(data);
      } catch (error) {
        console.error('Error fetching inleveringen:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (vakid) {
      fetchInleveringen();
    }
  }, [vakid]);

// Function to handle approval of a submission
const approveSubmission = async (item) => {
  try {
    // API call to approve the submission
    const approveResponse = await fetch(`${API_URL}/api/docent/approve/${item.GameID}/${item.GebruikersID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!approveResponse.ok) {
      throw new Error('Failed to approve submission');
    }

    // After successful approval, send a notification
    const notifyResponse = await fetch(`${API_URL}/api/send-notification/${item.GebruikersID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        body: `Jouw inlevering voor ${item.GameNaam} is goedgekeurd!`,
        data: {
          action: 'approved',
          itemId: item.GameID,
        }
      })
    });

    if (!notifyResponse.ok) {
      throw new Error('Failed to send approval notification');
    }

    const responseData = await notifyResponse.json();
    console.log('Notification sent:', responseData);
  } catch (error) {
    console.error('Error in approval process:', error);
  }
};

// Function to handle rejection of a submission
const rejectSubmission = async (item) => {
  try {
    // API call to reject the submission
    const rejectResponse = await fetch(`${API_URL}/api/docent/reject/${item.GameID}/${item.GebruikersID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!rejectResponse.ok) {
      throw new Error('Failed to reject submission');
    }

    // After successful rejection, send a notification
    const notifyResponse = await fetch(`${API_URL}/api/send-notification/${item.GebruikersID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        body: `jouw inlevering voor ${item.GameNaam} is  afgekeurd!`,
        data: {
          action: 'rejected',
          itemId: item.GameID,
        }
      })
    });

    if (!notifyResponse.ok) {
      throw new Error('Failed to send rejection notification');
    }

    const responseData = await notifyResponse.json();
    console.log('Notification sent:', responseData);
  } catch (error) {
    console.error('Error in rejection process:', error);
  }
};


  

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

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Inleveringen voor Vak ID: {vakid}</Text>
        <FlatList
          data={inleveringen}
          keyExtractor={(item) => item.GameID.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: `https://picsum.photos/seed/${vakid}/200` }} style={styles.image} />
              <View style={styles.content}>
                <Text style={styles.name}>Game Naam: {item.GameNaam}</Text>
                <View style={styles.instructionBox}>
                  <Text style={styles.opdrachtInlevering}>Opdracht Inlevering:</Text>
                  <ScrollView style={styles.scrollBox}>
                    <Text style={styles.giantTextBox}>{item.OpdrachtInlevering}</Text>
                  </ScrollView>
                </View>
                <Text style={styles.description}>Vak Naam: {item.VakNaam}</Text>
                <Text style={styles.description}>Student Nummer: {item.StudentEmail}</Text>
                <Text style={styles.description}>Student Naam: {item.UserName}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.approveButton]}
                  onPress={() => approveSubmission(item)}
                >
                  <FontAwesomeIcon icon={faCheck} color="#FFFFFF" size={20} />
                  <Text style={styles.buttonText}>Goedkeuren</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => rejectSubmission(item)}
                >
                  <FontAwesomeIcon icon={faTimes} color="#FFFFFF" size={20} />
                  <Text style={styles.buttonText}>Afkeuren</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  item: {
    flexDirection: 'row',
    backgroundColor: '#282828',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    marginLeft: 100,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  instructionBox: {
    flexDirection: 'column',
    marginBottom: 5,
    flex: 1,
  },
  opdrachtInlevering: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 5,
  },
  scrollBox: {
    maxHeight: 300, 
    width: '90%',
  },
  giantTextBox: {
    fontSize: 16, 
    color: '#ffffff',
  },
  description: {
    fontSize: 14,
    color: '#a9a9a9',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    marginLeft: 100,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 10,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
