import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ onToggle }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasToggled, setHasToggled] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    setHasToggled(true); 
    onToggle(!isExpanded);
  };

  return (
    <>
      {!isExpanded && (
        <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} style={styles.toggleButtonIcon} />
        </TouchableOpacity>
      )}
      <Animatable.View
        style={[styles.sidebar, isExpanded ? styles.expanded : styles.collapsed]}
        animation={hasToggled ? (isExpanded ? 'fadeInLeft' : 'fadeOutLeft') : undefined} 
        duration={300}
        easing={isExpanded ? 'ease-in-out' : 'ease-out-back'}
      >
        {isExpanded && (
          <>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Docent</Text>
              <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
                <FontAwesomeIcon icon={faTimes} style={styles.closeButtonIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.sidebarContent}>
              <NavigationItem href="/docent" hasToggled={hasToggled}>Overzicht</NavigationItem>
              <NavigationItem href="/docent/vakken" hasToggled={hasToggled}>Vakken</NavigationItem>
              <NavigationItem href="/docent/studenten" hasToggled={hasToggled}>Studenten</NavigationItem>
            </View>
          </>
        )}
      </Animatable.View>
    </>
  );
}

function NavigationItem({ href, children, hasToggled }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Animatable.View
      animation={hasToggled ? 'fadeInLeft' : undefined}
      duration={300}
      style={styles.navItemContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={href} style={[styles.navItem, isHovered && styles.navItemHovered]}>
        <Text style={[styles.navText, isHovered && styles.navTextHovered]}>{children}</Text>
      </Link>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: '#1e1e1e',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  expanded: {
    width: 250,
  },
  collapsed: {
    width: 0,
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#1f1f1f',
    padding: 10,
    borderRadius: 50,
    zIndex: 101,
    elevation: 5,
  },
  toggleButtonIcon: {
    color: 'white',
    fontSize: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  closeButton: {
    backgroundColor: 'transparent',
    padding: 5,
  },
  closeButtonIcon: {
    color: 'white',
    fontSize: 20,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 20,
  },
  navItemContainer: {
    marginBottom: 15,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    transition: 'background-color 0.3s ease',
  },
  navItemHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 15,
    transition: 'color 0.3s ease',
  },
  navTextHovered: {
    color: 'rgb(200, 200, 200)',
  },
});
