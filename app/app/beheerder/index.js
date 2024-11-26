import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { styles } from './styles';
import { useRouter } from 'expo-router';

const AdminDashboard = () => {
  const router = useRouter();
  const [docentCount, setDocentCount] = useState(0); 
  const [studentCount, setStudentCount] = useState(0); 
  const [domainCount, setDomainCount] = useState(0); 
  const [gameCount, setGameCount] = useState(0);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const sidePanelAnimation = useRef(new Animated.Value(0)).current;
  const dashboardContainerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkUserType();
    fetchDocentCount();
    fetchStudentCount(); 
    fetchGameCount();
    fetchDomainCount();
    fetchRecentRegistrations();
    
    
  }, []);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const checkUserType = async () => {
    try {
      const response = await fetch(`${API_URL}/api/check-session`);
      if (!response.ok) {
        throw new Error("Failed to fetch user type");
      }
      const data = await response.json();
      if (data.user_type !== 2) {
        router.push('/'); 
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

// aantal docenten
  const fetchDocentCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin-count`); 
      if (!response.ok) {
        throw new Error('Failed to fetch docent count');
      }
      const data = await response.json();
      setDocentCount(data.admin_count);
    } catch (error) {
      console.error('Error fetching docent count:', error);
    }
  };

  //aantal studenten
  const fetchStudentCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/student-count`); 
      if (!response.ok) {
        throw new Error('Failed to fetch student count');
      }
      const data = await response.json();
      setStudentCount(data.student_count);
    } catch (error) {
      console.error('Error fetching student count:', error);
    }
  };

  //aantal games
  const fetchGameCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/game-count`); 
      if (!response.ok) {
        throw new Error('Failed to fetch game count');
      }
      const data = await response.json();
      setGameCount(data.game_count);
    } catch (error) {
      console.error('Error fetching game count:', error);
    }
  };

  //aantal domains
  const fetchDomainCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/domain-count`); 
      if (!response.ok) {
        throw new Error('Failed to fetch domain count');
      }
      const data = await response.json();
      setDomainCount(data.domain_count); 
    } catch (error) {
      console.error('Error fetching domain count:', error);
    }
  };

  const fetchRecentRegistrations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recent-registrations`);
      if (!response.ok) {
        throw new Error("Failed to fetch recent_registrations");
      }
      const data = await response.json();
      setRecentRegistrations(data.recent_registrations);
    } catch (error) {
      console.error('Error fetching recent registrattions: ', error);
    }
  };

//side paneel
  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
    Animated.parallel([
      Animated.timing(sidePanelAnimation, {
        toValue: isSidePanelOpen ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(dashboardContainerAnimation, {
        toValue: isSidePanelOpen ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const closeSidePanel = () => {
    setIsSidePanelOpen(false);
    Animated.parallel([
      Animated.timing(sidePanelAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(dashboardContainerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  //navigators 
  const navigateToDashboard = () => {
    router.push('/beheerder');
  };

  const navigateToDocentInfo = () => {
    router.push('/beheerder/docentinfo');
  };

  const navigateToDomainInfo = () => {
    router.push('/beheerder/domaininfo');
  };

  const navigateToStudent= () => {
    router.push('/dashboard');
  };

  const navigateToDocent = () => {
    router.push('/docent');
  };



  return (
      <View style={styles.container}>
        <View style={[styles.secondaryNavbar, { zIndex: 1 }]}> 
          <TouchableOpacity onPress={toggleSidePanel}>
            <Text style={styles.sidePanelButton}>☰</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[
          styles.sidePanel,
          {
            transform: [
              {
                translateX: sidePanelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-250, 0],
                }),
              },
            ],
            zIndex: 2, 
          },
        ]}>
          <Image source={require('../../assets/favicon.png')} style={styles.logo} />
          <TouchableOpacity onPress={closeSidePanel} style={styles.closeSidePanelButtonContainer}>
            <Text style={styles.closeSidePanelButton}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidePanelItem} onPress={navigateToDashboard}>
            <MaterialIcons name="home" size={30} color="#fff" />
            <Text style={styles.sidePanelItemText}> Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidePanelItem} onPress={navigateToDocentInfo}>
            <MaterialIcons name="person" size={30} color="#fff" />
            <Text style={styles.sidePanelItemText}> Docent gegevens</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidePanelItem} onPress={navigateToDomainInfo}>
            <MaterialIcons name="computer" size={30} color="#fff" />
            <Text style={styles.sidePanelItemText}> Domein gegevens</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[
          styles.dashboardContainer,
          {
            transform: [
              {
                translateX: dashboardContainerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
                }),
              },
            ],
          },
        ]}>
        <View style={[styles.sectionContainer, styles.sectionContainerMarginTop]}>
          <View style={styles.leftSectionContainer}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.leftSectiontxt}>Home / </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/beheerder')}>
              <Text style={styles.leftSectiontxt}>Beheerder</Text>
            </TouchableOpacity>

            <Text style={[styles.leftSectionAdminDashboardTitle]}>Admin Dashboard</Text>
            
          </View>
  
          <View style={styles.rightSectionContainer}>
            <TouchableOpacity style={styles.rightSectionRButton} onPress={navigateToDocent}>
              <MaterialIcons name="dashboard" size={30} color="#fff" />
              <Text style={styles.rightSectionButtonText}>Docentdashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightSectionLButton} onPress={navigateToStudent}>
              <MaterialIcons name="dashboard" size={30} color="#fff" />
              <Text style={styles.rightSectionButtonText}>Studentdashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        <View style={[styles.dashboardSectionsContainer, styles.dashboardSectionsContainerMarginTop]}>
          <View style={styles.dashboardSection}>
            <Text style={styles.dashboardSectionTitle}>Aantal Studenten</Text>
            <View style={styles.dashboardSectionContent}>
              <Text style={styles.dashboardSectionCount}>{studentCount}</Text>
              <MaterialIcons name="person" size={60} color="#a336c1" style={styles.iconRight} />
            </View>
          </View>
          <View style={styles.dashboardSection}>
            <Text style={styles.dashboardSectionTitle}>Aantal Docenten</Text>
            <View style={styles.dashboardSectionContent}>
              <Text style={styles.dashboardSectionCount}>{docentCount}</Text>
              <MaterialIcons name="group" size={60} color="#a336c1" style={styles.iconRight} />
            </View>
          </View>
          <View style={styles.dashboardSection}>
            <Text style={styles.dashboardSectionTitle}>Aantal Games / opdrachten</Text>
            <View style={styles.dashboardSectionContent}>
              <Text style={styles.dashboardSectionCount}>{gameCount}</Text>
              <MaterialIcons name="monitor" size={60} color="#a336c1" style={styles.iconRight} />
            </View>
          </View>
          <View style={styles.dashboardSection}>
            <Text style={styles.dashboardSectionTitle}>Aantal Domains / vakken</Text>
            <View style={styles.dashboardSectionContent}>
              <Text style={styles.dashboardSectionCount}>{domainCount}</Text>
              <MaterialIcons name="computer" size={60} color="#a336c1" style={styles.iconRight} />
            </View>
          </View>
        </View>
        <View style={styles.midSectionContainer}>
          <View style={styles.midLeftSection}>
            <Text style={styles.midSectionTitle}>Snelkoppelingen</Text>
            <TouchableOpacity style={styles.midSectionButton} onPress={navigateToDocentInfo}>
              <MaterialIcons name="edit" size={24} color="#fff" />
              <Text style={styles.midSectionButtonText}>Docent gegevens</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.midSectionButton} onPress={navigateToDomainInfo}>
              <MaterialIcons name="computer" size={24} color="#fff" />
              <Text style={styles.midSectionButtonText}>Domein gegevens</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.midRightSection}>
            <Text style={styles.midSectionTitle}>Recente gebeurtenissen</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderItem, { textAlign: 'left' }]}>Actie</Text>
              <Text style={[styles.tableHeaderItem, { textAlign: 'right' }]}>Datum & tijd</Text>
            </View>
            <ScrollView style={{ maxHeight: 200, width: '100%' }}>
              {recentRegistrations.slice(0, 5).map((registration, index) => (
                <View key={index} style={styles.recentEventRow}>
                  <Text style={[styles.recentEventAction, { textAlign: 'left' }]}>
                    {registration.username} registratie
                  </Text>
                  <Text style={[styles.recentEventTime, { textAlign: 'right' }]}>
                    {registration.registration_date}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default AdminDashboard;
