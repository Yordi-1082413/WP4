import React from 'react';
import { View, Platform } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import NavigationBar from './navbar';
import Breadcrumbs from './breadcrumbs';

const Layout = () => {
  const pathname = usePathname();

  // Excluded Routes
  const excludedRoutes = ['/', '/loginsignup'];

  // True or false if route is in excludedroutes if true dont render
  const shouldRenderLayout = !excludedRoutes.includes(pathname);

  return (
    <View style={{ flex: 1 }}>
      {shouldRenderLayout && Platform.OS === 'web' && <NavigationBar />}
      <Slot />
      {shouldRenderLayout && Platform.OS !== 'web' && <NavigationBar />}
    </View>
  );
};

export default Layout;
