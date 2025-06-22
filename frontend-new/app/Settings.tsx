import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      {/* Здесь будут настройки */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, color: '#1976D2', fontWeight: 'bold' }
})