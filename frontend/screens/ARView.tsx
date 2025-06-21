import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ARView() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🤳 Здесь будет AR-режим. Поддержка камеры, навигации и распознавания!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});
