// frontend/screens/MapScreen.tsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { POI } from "../types";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pois, setPOIs] = useState<POI[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // 🧪 Мокаем POI, пока нет API
      setPOIs([
        {
          id: "1",
          name: "Байтерек",
          description: "Главный символ Астаны",
          lat: loc.coords.latitude + 0.001,
          lon: loc.coords.longitude + 0.001,
        },
        {
          id: "2",
          name: "Астана Опера",
          description: "Национальный театр оперы и балета",
          lat: loc.coords.latitude - 0.0015,
          lon: loc.coords.longitude - 0.0005,
        },
      ]);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Загрузка геолокации...</Text>
      </View>
    );
  }

  const region: Region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView style={styles.map} region={region} showsUserLocation>
      {pois.map((poi) => (
        <Marker
          key={poi.id}
          coordinate={{ latitude: poi.lat, longitude: poi.lon }}
          title={poi.name}
          description={poi.description}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
