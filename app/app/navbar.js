import React, { useState, useEffect } from 'react';
import { Platform, Pressable, View, StyleSheet, Image, Text } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faBook, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import Breadcrumbs from './breadcrumbs';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const NavigationBar = () => {
  const [userAvatar, setUserAvatar] = useState(null);
  const [userType, setUserType] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  const fetchUserAvatar = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile/userinfo`, {
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
      const userinfo = data.userinfo[0];
      setUserAvatar(userinfo.avatarUrl);
      setUserType(userinfo.UserType);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: faHome, label: 'Dashboard' },
  ];
  if (userType === 1) {
    navItems.push({ name: 'Docent', path: '/docent', icon: faUserGraduate, label: 'Docent' });
  }


  const renderNavItems = () => {
    return navItems.map((item, index) => (
      <Pressable key={index} style={styles.navItem}>
        <Link href={item.path}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={item.icon} size={30} color="white" />
            <Text style={styles.iconLabel}>{item.label}</Text>
          </View>
        </Link>
      </Pressable>
    ));
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.navBarWeb}>
        <View style={styles.logoContainer}>
          <Link href="/dashboard"> 
            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
            />
          </Link> 
          <Breadcrumbs />
        </View>

        <View style={styles.navItemsContainer}>
          {renderNavItems()}
          <Pressable
            style={styles.userAvatarContainer}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <Link href="/profile">
              <Image
                source={
                  userAvatar && userAvatar !== 'none'
                    ? { uri: `${API_URL}/api/profile/images/${userAvatar}` }
                    : require('../assets/astronessie.png')
                }
                style={styles.userAvatar}
              />
            </Link>
            {tooltipVisible && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>Profile</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.navBarMobile}>
        {renderNavItems()}
        <Pressable style={styles.navItem}>
          <Link href="/profile">
            <View style={styles.iconContainer}>
            <Image
                source={
                  userAvatar && userAvatar !== 'none'
                    ? { uri: `${API_URL}/api/profile/images/${userAvatar}` }
                    : require('../assets/astronessie.png')
                }
                style={styles.userAvatar}
              />
              <Text style={styles.iconLabel}>Profile</Text>
            </View>
          </Link>
        </Pressable>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  navItem: {
    padding: 10,
    alignItems: 'center',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  iconContainer: {
    alignItems: 'center',
    width: 60,
  },
  iconLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
  navBarWeb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgb(24, 24, 24)',
  },
  navBarMobile: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#191414',
    borderTopWidth: 1,
    borderTopColor: '#282828',
    alignItems: 'center',
  },
  navItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    left: 30,
    resizeMode: 'contain',
  },
  userAvatarContainer: {
    marginLeft: 20,
    position: 'relative',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  tooltip: {
    position: 'absolute',
    top: 35,
    left: -5,
    backgroundColor: 'rgb(22, 22, 22)',
    padding: 5,
    borderRadius: 5,
    zIndex: 1000,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
});

export default NavigationBar;
