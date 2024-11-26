import React from 'react';
import { View, Text } from 'react-native';
import Navbar from '../../global/navbar/navbar';

function DocentDashboard() {
  return (
    <View>
      <Navbar />
      <View>
        <Text>Docent Dashboard</Text>
        {/* Voeg hier de rest van de inhoud van je pagina toe */}
      </View>
    </View>
  );
}

export default DocentDashboard;
