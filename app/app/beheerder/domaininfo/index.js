import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Image, ActivityIndicator, TextInput, Alert, CheckBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

const DomainInfo = () => {
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDomainModalVisible, setNewDomainModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchDomains();
  }, []);

  // Domeinen ophalen
  const fetchDomains = () => {
    setLoading(true);
    fetch(`${API_URL}/api/domaininfo`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setDomains(data);
        setFilteredDomains(data);
      })
      .catch(error => console.error('Error fetching domain data:', error))
      .finally(() => setLoading(false));
  };

  // Domeinen bekijken
  const handleViewDomain = (domainId) => {
    setLoading(true);
    fetch(`${API_URL}/api/domaininfo/${domainId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch domain data');
        }
        return response.json();
      })
      .then(data => {
        setSelectedDomain(data);
        setModalVisible(true);
      })
      .catch(error => console.error('Error fetching domain data:', error))
      .finally(() => setLoading(false));
  };

  // Domeinen bewerken
  const handleEditDomain = () => {
    setEditMode(true);
  };

  const handleSaveDomain = () => {
    setLoading(true);
    const userTypeValue = parseInt(selectedDomain.DomainID);
    if (isNaN(userTypeValue)) {
      console.error('Ongeldige invoer voor UserType');
      Alert.alert('Error', 'Ongeldige invoer voor UserType');
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/domaininfo/${selectedDomain.DomainID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        naam: selectedDomain.Naam,
        omschrijving: selectedDomain.Beschrijving,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update domain data');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setSuccessMessage('Succesvol opgeslagen');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        setModalVisible(false);
        setEditMode(false);
        setSelectedDomain(null);
        setLoading(false);
        fetchDomains();
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating domain data:', error);
        Alert.alert('Error', 'Failed to update domain data');
        setLoading(false);
      });
  };

  // Zoeken
  const handleSearch = (text) => {
    setSearch(text);
    filterData(text);
  };

  const filterData = (text) => {
    if (text) {
      const filtered = domains.filter(domain =>
        domain.Naam.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDomains(filtered);
    } else {
      setFilteredDomains(domains);
    }
  };

  const openNewDomainModal = () => {
    setNewDomainModalVisible(true);
    setEditMode(false); 
    setSelectedDomain(null);
    setNewDomainName('');
    setNewDomainDescription('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Zoeken..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      <View style={styles.pageContainer}>
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <MaterialIcons name="dashboard" size={40} color='#a336c1' />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.sectionTitle}>Welkom op de domeinen info pagina!</Text>
              <View style={styles.sectionTextContainer}>
                <Text style={styles.sectionText}>Hier vindt u alle relevante informatie of gegevens over domeinen.</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <MaterialIcons name="computer" size={40} color='#a336c1' />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.sectionTitle}>Totaal aantal domeinen</Text>
              <Text style={[styles.sectionText, { fontSize: 24 }]}>{domains.length}</Text>
            </View>
          </View>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>DomainID</Text>
            <Text style={styles.headerText}>Naam</Text>
            <Text style={styles.headerText}>Beschrijving</Text>
            <Text style={styles.headerText}>Actie</Text>
          </View>
          {Array.isArray(filteredDomains) ? filteredDomains.map(domain => (
            <View key={domain.DomainID} style={styles.domainRow}>
              <Text style={styles.domainText}>{domain.DomainID}</Text>
              <Text style={styles.domainText}>{domain.Naam}</Text>
              <Text style={styles.domainText}>{domain.Beschrijving}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewDomain(domain.DomainID)}
              >
                <Text style={styles.viewButtonText}>Bekijk</Text>
              </TouchableOpacity>
            </View>
          )) : (
            <View style={styles.noDomainContainer}>
              <Text style={styles.noDomainText}>Geen gegevens gevonden.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {selectedDomain && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
              setEditMode(false);
              setSelectedDomain(null);
            }}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => {
                  setModalVisible(false);
                  setEditMode(false);
                  setSelectedDomain(null);
                }}
              />
              
              <View style={styles.modalView}>
                {loading ? (
                  <ActivityIndicator size="large" color="purple" />
                ) : (
                  <>
                    <Text style={styles.label}>Naam</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.input}
                        value={selectedDomain.Naam}
                        onChangeText={(text) => setSelectedDomain({ ...selectedDomain, Naam: text })}
                      />
                    ) : (
                      <Text style={styles.name}>{selectedDomain.Naam}</Text>
                    )}
                    <Text style={styles.label}>Beschrijving</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.input}
                        value={selectedDomain.Beschrijving}
                        onChangeText={(text) => setSelectedDomain({ ...selectedDomain, Beschrijving: text })}
                      />
                    ) : (
                      <Text style={styles.Beschrijving}>{selectedDomain.Beschrijving}</Text>
                    )}
                    <View style={styles.buttonContainer}>
                      {editMode ? (
                        <TouchableOpacity
                          style={styles.saveButton}
                          onPress={handleSaveDomain}
                        >
                          <Text style={styles.saveButtonText}>Opslaan</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={handleEditDomain}
                        >
                          <Text style={styles.editButtonText}>Bewerken</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                          setModalVisible(false);
                          setEditMode(false);
                          setSelectedDomain(null);
                        }}
                      >
                        <Text style={styles.closeButtonText}>Sluiten</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {successMessage !== '' && (
                  <Text style={styles.successMessage}>{successMessage}</Text>
                )}
              </View>
            </View>
          </Modal>
        )}
      </View>
  );
};

export default DomainInfo;