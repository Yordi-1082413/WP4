import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Image, ActivityIndicator, TextInput, Alert, CheckBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

const TeacherInfo = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterRole, setFilterRole] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [docentChecked, setDocentChecked] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [alphabeticalChecked, setAlphabeticalChecked] = useState(false);
  const navigation = useNavigation();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchTeachers();
  }, []);

  //dopcenten ophalen
  console.log(API_URL);
  const fetchTeachers = () => {
    setLoading(true);
    fetch(`${API_URL}/api/teacherinfo`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTeachers(data);
        setFilteredTeachers(data);
      })
      .catch(error => console.error('Error fetching teacher data:', error))
      .finally(() => setLoading(false));
  };

  //docenten bekijken
  const handleViewTeacher = (teacherId) => {
    setLoading(true);
    fetch(`${API_URL}/api/teacherinfo/${teacherId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedTeacher(data);
        setModalVisible(true);
      })
      .catch(error => console.error('Error fetching teacher data:', error))
      .finally(() => setLoading(false));
  };

  //docenten bewerken
  const handleEditTeacher = () => {
    setEditMode(true);
  };

  const handleSaveTeacher = () => {
    setLoading(true);
    const userTypeValue = parseInt(selectedTeacher.UserType);
    if (isNaN(userTypeValue)) {
      console.error('Ongeldige invoer voor UserType');
      Alert.alert('Error', 'Ongeldige invoer voor UserType');
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/teacherinfo/${selectedTeacher.GebruikerID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gebruikersnaam: selectedTeacher.GebruikersNaam,
        email: selectedTeacher.Email,
        usertype: userTypeValue,
        avatar_url: selectedTeacher.avatarUrl,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update teacher data');
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
        setSelectedTeacher(null);
        setLoading(false);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating teacher data:', error);
        Alert.alert('Error', 'Failed to update teacher data');
        setLoading(false);
      });
  };

  //zoeken
  const handleSearch = (text) => {
    setSearch(text);
    filterData(text, filterRole);
  };

  //filteren
  const handleFilter = (newDocentChecked, newAdminChecked, newAlphabeticalChecked) => {
    let role = null;
    if (newDocentChecked && !newAdminChecked) role = 1;
    else if (!newDocentChecked && newAdminChecked) role = 2;
    else if (newDocentChecked && newAdminChecked) role = null;
  
    setDocentChecked(newDocentChecked);
    setAdminChecked(newAdminChecked);
    setAlphabeticalChecked(newAlphabeticalChecked);
  
    let filtered = teachers.filter(teacher =>
      (teacher.GebruikersNaam.toLowerCase().includes(search.toLowerCase()) ||
        teacher.Email.toLowerCase().includes(search.toLowerCase())) &&
      (role ? teacher.UserType.toString() === role.toString() : true)
    );
  
    if (newAlphabeticalChecked) {
      filtered.sort((a, b) => a.GebruikersNaam.localeCompare(b.GebruikersNaam));
    }
  
    setFilteredTeachers(filtered);
  };

  const filterData = (searchText, role) => {
    let filtered = teachers.filter(teacher =>
      (teacher.GebruikersNaam.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher.Email.toLowerCase().includes(searchText.toLowerCase())) &&
      (role ? teacher.UserType.toString() === role.toString() : true)
    );
    setFilteredTeachers(filtered);
  };

  const clearFilter = () => {
    setDocentChecked(false);
    setAdminChecked(false);
    setAlphabeticalChecked(false);
    setFilterRole(null);
    filterData(search, null);
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

          <TouchableOpacity onPress={() => setFilterVisible(!filterVisible)} style={styles.filterButton}>
            <MaterialIcons name="filter-list" size={24} color='#a336c1' />
          </TouchableOpacity>
        </View>
      </View>

    {filterVisible && (
      <View style={styles.filterOverlay}>
        <View style={styles.filterBar}>
          <View style={styles.filterItem}>
            <CheckBox
              value={alphabeticalChecked}
              onValueChange={() => handleFilter(docentChecked, adminChecked, !alphabeticalChecked)}
            />
            <Text style={styles.filterText}>Alfabetisch</Text>
          </View>
          <View style={styles.filterItem}>
            <CheckBox
              value={adminChecked}
              onValueChange={() => handleFilter(docentChecked, !adminChecked, alphabeticalChecked)}
            />
            <Text style={styles.filterText}>Admins</Text>
          </View>
          <View style={styles.filterItem}>
            <CheckBox
              value={docentChecked}
              onValueChange={() => handleFilter(!docentChecked, adminChecked, alphabeticalChecked)}
            />
            <Text style={styles.filterText}>Docenten</Text>
          </View>
          <TouchableOpacity onPress={clearFilter} style={styles.clearFilterButton}>
            <Text style={styles.clearFilterButtonText}>Wissen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterVisible(false)}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
)}

      <View style={styles.pageContainer}>
        <View style={styles.sectionContainer}>
          <View style={styles.section}>
            <MaterialIcons name="dashboard" size={40} color='#a336c1' />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.sectionTitle}>Welkom op de docenten info pagina!</Text>
              <View style={styles.sectionTextContainer}>
                <Text style={styles.sectionText}>Hier vindt u alle relevante informatie of gegevens over docenten.</Text>
                <Text style={styles.sectionText}>Role: 1 zijn docenten, Role: 2 zijn admins.</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <MaterialIcons name="people" size={40} color='#a336c1' />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.sectionTitle}>Totaal aantal docenten</Text>
              <Text style={[styles.sectionText, { fontSize: 24 }]}>{teachers.length}</Text>
            </View>
          </View>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Medewerker-ID</Text>
            <Text style={styles.headerText}>Gebruikersnaam</Text>
            <Text style={styles.headerText}>Email</Text>
            <Text style={styles.headerText}>Role</Text>
            <Text style={styles.headerText}>Actie</Text>
          </View>
          {Array.isArray(filteredTeachers) ? filteredTeachers.map(teacher => (
            <View key={teacher.GebruikerID} style={styles.teacherRow}>
              <Text style={styles.teacherText}>{teacher.GebruikerID}</Text>
              <Text style={styles.teacherText}>{teacher.GebruikersNaam}</Text>
              <Text style={styles.teacherText}>{teacher.Email}</Text>
              <Text style={styles.teacherText}>{teacher.UserType}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewTeacher(teacher.GebruikerID)}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          )) : (
            <View style={styles.noTeachersContainer}>
              <Text style={styles.noTeachersText}>Geen gegevens gevonden.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {selectedTeacher && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
              setEditMode(false);
              setSelectedTeacher(null);
            }}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => {
                  setModalVisible(false);
                  setEditMode(false);
                  setSelectedTeacher(null);
                }}
              />
              
              <View style={styles.modalView}>
                {loading ? (
                  <ActivityIndicator size="large" color="purple" />
                ) : (
                  <>
                    <Image
                      source={
                        selectedTeacher.avatarUrl
                          ? { uri: `http://localhost:8000/api/profile/images/${selectedTeacher.avatarUrl}` }
                          : require('../../../assets/astronessie.png')
                      }
                      style={styles.avatar}
                    />
                    <Text style={styles.label}>Gebruikersnaam</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.input}
                        value={selectedTeacher.GebruikersNaam}
                        onChangeText={(text) => setSelectedTeacher({ ...selectedTeacher, GebruikersNaam: text })}
                      />
                    ) : (
                      <Text style={styles.name}>{selectedTeacher.GebruikersNaam}</Text>
                    )}
                    <Text style={styles.label}>Email</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.input}
                        value={selectedTeacher.Email}
                        onChangeText={(text) => setSelectedTeacher({ ...selectedTeacher, Email: text })}
                      />
                    ) : (
                      <Text style={styles.email}>{selectedTeacher.Email}</Text>
                    )}
                    <Text style={styles.label}>Role</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.input}
                        value={selectedTeacher.UserType.toString()}
                        onChangeText={(text) => setSelectedTeacher({ ...selectedTeacher, UserType: parseInt(text) })}
                      />
                    ) : (
                      <Text style={styles.role}>{selectedTeacher.UserType}</Text>
                    )}
                    <View style={styles.buttonContainer}>
                      {editMode ? (
                        <TouchableOpacity
                          style={styles.saveButton}
                          onPress={handleSaveTeacher}
                        >
                          <Text style={styles.saveButtonText}>Opslaan</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={handleEditTeacher}
                        >
                          <Text style={styles.editButtonText}>Bewerken</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                          setModalVisible(false);
                          setEditMode(false);
                          setSelectedTeacher(null);
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

export default TeacherInfo;
