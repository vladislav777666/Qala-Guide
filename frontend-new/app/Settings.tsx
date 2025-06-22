import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  // Загрузка сохранённых данных при открытии
  React.useEffect(() => {
    (async () => {
      const savedAvatar = await AsyncStorage.getItem('userAvatar');
      const savedName = await AsyncStorage.getItem('userName');
      if (savedAvatar) setAvatar(savedAvatar);
      if (savedName) setName(savedName);
    })();
  }, []);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Нет доступа к галерее');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: false,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setAvatar(result.assets[0].uri);
      await AsyncStorage.setItem('userAvatar', result.assets[0].uri);
    }
  };

  const saveName = async (text: string) => {
    setName(text);
    await AsyncStorage.setItem('userName', text);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickAvatar}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={{ color: '#fff', fontSize: 32 }}>+</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.label}>Имя пользователя:</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите имя"
        value={name}
        onChangeText={saveName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1976D2',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1976D2',
  },
  label: { fontSize: 18, color: '#1976D2', marginBottom: 8 },
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
});