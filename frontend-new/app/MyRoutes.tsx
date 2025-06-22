import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function MyRoutes() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои маршруты</Text>
      {/* Здесь будет список маршрутов */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, color: '#1976D2', fontWeight: 'bold' }
})