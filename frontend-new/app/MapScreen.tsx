// frontend/screens/MapScreen.tsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Camera } from 'expo-camera';

const POIS = [
  { id: 1, title: "Музей", description: "Интересный музей", lat: 55.751244, lng: 37.618423, category: "museum" },
  { id: 2, title: "Кафе", description: "Лучшее кафе", lat: 55.752244, lng: 37.619423, category: "cafe" }
];

const MapScreen = () => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [cameraGranted, setCameraGranted] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedRouteId = params.routeId;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Нет доступа к геопозиции");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleAR = async () => {
    // Запрос камеры (только для iOS/Android)
    if (Platform.OS !== "web") {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ошибка", "Нет доступа к камере");
        return;
      }
      setCameraGranted(true);
    }
    router.push("/ARView");
  };

  const handlePOI = (poi: any) => {
    router.push({ pathname: "/POIDetails", params: { id: poi.id } });
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 55.751244,
          longitude: location?.longitude || 37.618423,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        showsUserLocation
      >
        {POIS.map(poi => (
          <Marker
            key={poi.id}
            coordinate={{ latitude: poi.lat, longitude: poi.lng }}
            title={poi.title}
            description={poi.description}
            onPress={() => handlePOI(poi)}
            pinColor={poi.category === "museum" ? "#1976D2" : "#64B5F6"}
          />
        ))}
        <Polyline
          coordinates={POIS.map(poi => ({ latitude: poi.lat, longitude: poi.lng }))}
          strokeColor="#1976D2"
          strokeWidth={4}
        />
      </MapView>
      {/* Кнопка AR */}
      <TouchableOpacity
        style={styles.fab}
        onPress={async () => {
          // Запрос разрешения на камеру
          const { status } = await Camera.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Нет доступа к камере", "Разрешите доступ в настройках телефона");
            return;
          }
          router.push("/ARView");
        }}
      >
        <Icon name="camera-alt" size={28} color="#fff" />
        <Text style={styles.fabText}>Камера</Text>
      </TouchableOpacity>
      {/* Кнопка "Начать маршрут" */}
      <TouchableOpacity style={styles.routeBtn} onPress={() => Alert.alert("Маршрут", "Маршрут начат!")}>
        <Icon name="directions" size={22} color="#fff" />
        <Text style={styles.routeBtnText}>Начать маршрут</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F9FF" },
  map: { flex: 1 },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 24,
    backgroundColor: "#1976D2",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    elevation: 6,
    shadowColor: "#1976D2",
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  fabText: { color: "#fff", fontSize: 18, marginLeft: 8 },
  routeBtn: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: "#1565C0",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    elevation: 4
  },
  routeBtnText: { color: "#fff", fontSize: 18, marginLeft: 8 },
  error: { color: "red", fontSize: 18, textAlign: "center", marginTop: 40 }
});

export default MapScreen;
