import React, { useState, useEffect } from 'react';
import { View, Text, Box, Select , _selectedItem,ScrollView , Pressable, Picker, Button, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSchool, faSquarePollHorizontal, faX } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocalSearchParams } from 'expo-router';

function Subjects(){
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const params = useLocalSearchParams(); // DomainID ophalen uit de URL
const {DomainId} = params;
const parameters = new URLSearchParams({
  DomainId: DomainId,
      });
const [records, setRecords] = useState([]);
const [instanties, setInstanties] = useState([]);

    useEffect(() => {
        getSubjects();
    }, []);

useEffect(() => {
  fetch(`${API_URL}/subjects/getinstanties`, {
    method: 'GET',
    headers: {
    "Accept": "application/json",
    'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => setInstanties( data))
  .catch(err => console.log(err))
  console.log(instanties)
 }, []);
  const getSubjects = async () => {
    try {
        const response = await fetch(`${API_URL}/subjects/getsubjects?` + parameters, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setRecords(data);
    } catch (error) {
        console.error('Error:', error);
        setError(error.message);
    }
};


return (
  <ScrollView style={styles.wrapper}>
    <View style={styles.container}>
      <View style={styles.domainContainer}>
        <View style={styles.domainTitleContainer}>
          <Text style={styles.domainTitle}>Mijn curcussen</Text>
        </View>
        {records.map((list, index) => (
          <View key={index} style={styles.domain}>
            <Link href={{ pathname: "modulen", params: { VakId: list[0] } }}>
              <View style={styles.domainContent}>
                <View style={styles.domainTextContainer}>
                  <Text style={styles.title}>{list[1]}</Text>
                  <Text style={styles.text}>{list[2]}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <FontAwesomeIcon icon={faSquarePollHorizontal} style={styles.icon} size={40} />
                </View>
              </View>
            </Link>
          </View>
        ))}
      </View>
    </View>
  </ScrollView>
);
}

export default Subjects;

const styles = StyleSheet.create({
wrapper: {
  flex: 1,
  backgroundColor: '#121212',
},
container: {
  flex: 1,
  alignItems: 'center',
  paddingVertical: 30,
},
domainContainer: {
  width: '90%',
  alignItems: 'center',
},
domainTitleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#282828',
  padding: 10,
  borderRadius: 5,
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
domainTitle: {
  color: '#a336c1',
  fontSize: 17,
  fontWeight: '700',
},
titleIcon: {
  color: '#a336c1',
},
domain: {
  width: '100%',
  backgroundColor: '#282828',
  padding: 15,
  borderRadius: 5,
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
domainContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
domainTextContainer: {
  flex: 3,
},
iconContainer: {
  flex: 1,
  alignItems: 'flex-end',
  justifyContent: 'center',
},
icon: {
  color: '#a336c1',
},
title: {
  color: '#a336c1',
  fontSize: 17,
  fontWeight: '700',
  marginBottom: 5,
},
text: {
  color: 'white',
  fontSize: 16,
},
});