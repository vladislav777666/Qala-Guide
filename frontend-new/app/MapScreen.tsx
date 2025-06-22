// frontend/screens/MapScreen.tsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
// Уберите импорт react-native-maps, если работаете только в Expo Go
// import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

const MapScreen = () => {
  if (Platform.OS === 'web' || Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <Text>Карта доступна только в кастомном Expo dev-клиенте или на собранном приложении.</Text>
      </View>
    );
  }
  // Здесь может быть ваш MapView для кастомного клиента
  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default MapScreen;
