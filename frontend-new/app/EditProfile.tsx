import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { supabase } from '../supabaseClient'
import { useRouter } from 'expo-router'

export default function EditProfile() {
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.user.id)
          .single()
        setFullName(profile?.full_name || '')
      }
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: fullName })
    setLoading(false)
    if (error) Alert.alert('Ошибка', error.message)
    else {
      Alert.alert('Успех', 'Профиль обновлен!')
      router.back()
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Редактировать профиль</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя"
        value={fullName}
        onChangeText={setFullName}
      />
      <Button title={loading ? 'Сохраняю...' : 'Сохранить'} onPress={handleSave} disabled={loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F9FF' },
  title: { fontSize: 24, color: '#1976D2', marginBottom: 20, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#1976D2', borderRadius: 8, padding: 12, width: '80%', marginBottom: 16, backgroundColor: '#fff' }
})