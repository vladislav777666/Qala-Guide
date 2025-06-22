// frontend/screens/MapScreen.tsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Camera } from 'expo-camera';
import { supabase } from '../supabaseClient'; // убедитесь, что путь корректный

const ASTANA_POI = [
  { id: 1, title: 'Байтерек', coords: [51.1281, 71.4304] },
  { id: 2, title: 'Дворец Мира и Согласия', coords: [51.1205, 71.4450] },
  { id: 3, title: 'Астана Опера', coords: [51.1292, 71.4165] },
];

const MapScreen = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [cameraGranted, setCameraGranted] = useState(false);
  const router = useRouter();
  const { routeId } = useLocalSearchParams();
  const selectedRouteId = routeId;

  // routeId может быть string | string[] | undefined
  const routeIdNum = Array.isArray(selectedRouteId) ? Number(selectedRouteId[0]) : Number(selectedRouteId);

  const route = ASTANA_POI.find(r => r.id === routeIdNum);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Нет доступа к геолокации');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      // Сохраняем в БД (например, в таблицу 'locations')
      const { data: userData } = await supabase.auth.getUser();
      await supabase
        .from('locations')
        .insert([
          {
            user_id: userData?.user?.id,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: new Date().toISOString(),
          },
        ]);
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

  if (!route) return <View><ActivityIndicator /></View>;
  if (!location) return <View><ActivityIndicator /></View>;

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
          latitude: route.coords[0],
          longitude: route.coords[1],
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{ latitude: route.coords[0], longitude: route.coords[1] }}
          title={route.title}
        />
        <Marker
          coordinate={location}
          title="Вы"
          pinColor="blue"
        />
        <Polyline
          coordinates={[
            location,
            { latitude: route.coords[0], longitude: route.coords[1] }
          ]}
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
