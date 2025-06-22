import React from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  Детали: {
    name: string;
    description: string;
    lat: number;
    lon: number;
  };
};

type POIDetailsRouteProp = RouteProp<RootStackParamList, "Детали">;

export default function POIDetails() {
  const route = useRoute<POIDetailsRouteProp>();
  const { name, description, lat, lon } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.coords}>
        📍 {lat.toFixed(5)}, {lon.toFixed(5)}
      </Text>
      <Text style={styles.desc}>{description}</Text>
      <Button title="Добавить в маршрут" onPress={() => alert("Добавлено!")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  coords: {
    fontSize: 14,
    marginBottom: 10,
    color: "#888",
  },
  desc: {
    fontSize: 16,
    marginBottom: 20,
  },
});
