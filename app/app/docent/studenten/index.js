import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Layout from '../layout';
import ModalComponent from './emailmodal';
import EditStudentModal from './editmodal';

export default function StudentenManagement() {
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [studentInfo, setStudentInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchStudentInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/docent/getstudents`, {
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
      setStudentInfo(data.studentinfo);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  const handleInvitePress = () => {
    setIsInviteModalVisible(true);
  };

  const handleInviteModalClose = () => {
    setIsInviteModalVisible(false);
  };

  const handleStudentPress = (student) => {
    setSelectedStudent(student);
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = (updatedStudent) => {
    setStudentInfo((prevInfo) =>
      prevInfo.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const handleDeleteStudent = (studentId) => {
    setStudentInfo((prevInfo) => prevInfo.filter((student) => student.id !== studentId));
  };

  if (loading) {
    return (
      <Layout>
        <ActivityIndicator size="large" color="purple" />;
      </Layout>
    );
  }

  const filteredStudents = studentInfo.filter(student =>
    student.name.toLowerCase().includes(searchText.toLowerCase()) ||
    student.studentNumber.includes(searchText) ||
   (student.studentClass?.toLowerCase() || '').includes(searchText.toLowerCase())  
  );

  const sortedStudents = filteredStudents.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const handleSearch = text => {
    setSearchText(text);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity style={styles.studentItem} onPress={() => handleStudentPress(item)}>
      <Text style={styles.studentName}>{item.name}</Text>
      <Text style={styles.studentDetails}>Student nummer: {item.studentNumber}</Text>
      <Text style={styles.studentDetails}>Klas: {item.studentClass}</Text>
      <Text style={styles.hiddenText}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Student Management</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, student number, or class"
            placeholderTextColor={styles.placeholderTextColor}
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        <View style={styles.listHeader}>
          <TouchableOpacity onPress={toggleSortOrder}>
            <Text style={styles.listHeaderText}>
              Name {sortOrder === 'asc' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inviteButton} onPress={handleInvitePress}>
            <Text style={styles.inviteButtonText}>Invite</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={sortedStudents}
          renderItem={renderStudentItem}
        />
      </View>
      <ModalComponent
        visible={isInviteModalVisible}
        onClose={handleInviteModalClose}
      />
      {selectedStudent && (
        <EditStudentModal
          visible={isEditModalVisible}
          onClose={handleEditModalClose}
          student={selectedStudent}
          onSave={handleSaveStudent}
          onDelete={handleDeleteStudent}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#181818',
    marginLeft: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: '#ffffff',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  inviteButton: {
    backgroundColor: '#a336c1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  studentItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#282828',
    borderRadius: 5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  studentDetails: {
    fontSize: 14,
    color: 'gray',
  },
  hiddenText: {
    display: 'none',
  },
});
