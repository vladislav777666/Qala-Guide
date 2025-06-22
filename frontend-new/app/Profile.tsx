import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '../supabaseClient'
import { useRouter } from 'expo-router'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Route = {
  id: number;
  title: string;
  coords: [number, number];
};

const POPULAR_ROUTES: Route[] = [
  { id: 1, title: 'Байтерек', coords: [51.1281, 71.4304] },
  { id: 2, title: 'Дворец Мира и Согласия', coords: [51.1205, 71.4450] },
  { id: 3, title: 'Астана Опера', coords: [51.1292, 71.4165] },
];

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [ttsLang, setTtsLang] = useState('ru-RU')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
          .then(({ data }) => setProfile(data))
      }
    })
    AsyncStorage.getItem('ttsLang').then(lang => {
      if (lang) setTtsLang(lang)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/Login')
  }

  const handleTtsLang = async (lang: string) => {
    setTtsLang(lang);
    await AsyncStorage.setItem('ttsLang', lang);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Загрузка профиля...</Text>
      </View>
    )
  }

  const initials = (profile?.full_name || user.email || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        {/* Аватар */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{profile?.full_name || 'Имя не указано'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {/* Язык интерфейса */}
        <View style={styles.langRow}>
          <Text style={styles.label}>Язык интерфейса:</Text>
          <Text style={styles.flag}>🇷🇺</Text>
          <Text style={styles.flag}>🇰🇿</Text>
          <Text style={styles.flag}>🇬🇧</Text>
        </View>
        {/* Популярные маршруты */}
        <View style={styles.routesBlock}>
          <Text style={styles.routesTitle}>Популярные маршруты:</Text>
          {POPULAR_ROUTES.map(route => (
            <TouchableOpacity
              key={route.id}
              style={styles.routeBtn}
              onPress={() => router.push({ pathname: '/MapScreen', params: { routeId: route.id } })}
            >
              <Icon name="map" size={20} color="#fff" />
              <Text style={styles.routeBtnText}>{route.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Кнопки */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/MyRoutes')}>
          <Icon name="map" size={22} color="#fff" />
          <Text style={styles.buttonText}>Мои маршруты</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/Settings')}>
          <Icon name="settings" size={22} color="#fff" />
          <Text style={styles.buttonText}>Настройки</Text>
        </TouchableOpacity>
        {/* Язык озвучки */}
        <View style={styles.ttsRow}>
          <Icon name="volume-up" size={22} color="#1976D2" />
          <Text style={styles.label}>Язык озвучки:</Text>
          <TouchableOpacity onPress={() => handleTtsLang('ru-RU')}>
            <Text style={[styles.ttsFlag, ttsLang === 'ru-RU' && styles.ttsFlagActive]}>🇷🇺</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTtsLang('en-US')}>
            <Text style={[styles.ttsFlag, ttsLang === 'en-US' && styles.ttsFlagActive]}>🇬🇧</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTtsLang('kk-KZ')}>
            <Text style={[styles.ttsFlag, ttsLang === 'kk-KZ' && styles.ttsFlagActive]}>🇰🇿</Text>
          </TouchableOpacity>
        </View>
        {/* Выйти */}
        <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
          <Icon name="logout" size={22} color="#fff" />
          <Text style={styles.buttonText}>Выйти</Text>
        </TouchableOpacity>
        {/* Версия */}
        <Text style={styles.version}>Версия приложения: v1.0.0</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  },
  bg: { flex: 1, backgroundColor: '#F5F9FF', justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#1976D2',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 40,
  },
  avatar: {
    backgroundColor: '#1976D2',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1976D2', marginBottom: 4 },
  email: { fontSize: 16, color: '#1565C0', marginBottom: 12 },
  langRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 16, color: '#1976D2', marginRight: 8 },
  flag: { fontSize: 22, marginHorizontal: 2 },
  routesBlock: { width: '100%', marginVertical: 12 },
  routesTitle: { fontSize: 18, color: '#1976D2', marginBottom: 8, fontWeight: 'bold' },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  routeBtnText: { color: '#fff', fontSize: 16, marginLeft: 8 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginVertical: 6,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, marginLeft: 8 },
  ttsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  ttsFlag: { fontSize: 22, marginHorizontal: 6, opacity: 0.5 },
  ttsFlagActive: { opacity: 1, textDecorationLine: 'underline' },
  logout: { backgroundColor: '#1565C0', marginTop: 16 },
    version: { color: '#64B5F6', marginTop: 18, fontSize: 14 },
  })