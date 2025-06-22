import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function RouteDetails() {
  // Здесь можно получить параметры маршрута через useLocalSearchParams из expo-router
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Детали маршрута</Text>
      {/* Здесь будет подробная информация о маршруте */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F9FF' },
  title: { fontSize: 24, color: '#1976D2', fontWeight: 'bold' }
})