//Layout specific for docent pages
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleSidebarToggle = (isExpanded) => {
    setIsSidebarExpanded(isExpanded);
  };

  return (
    <View style={styles.container}>
      <Sidebar onToggle={handleSidebarToggle} />
      <View style={[styles.content, isSidebarExpanded && styles.contentShifted]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#181818',
  },
  content: {
    flex: 1,
    padding: 20,
    transition: 'margin-left 0.3s ease',
  },
  contentShifted: {
    marginLeft: 150,
  },
});
