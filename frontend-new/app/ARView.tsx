import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

const GEMINI_API_KEY = Constants?.expoConfig?.extra?.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`;

export default function ARView() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [mediaPermission, setMediaPermission] = useState<boolean>(false);
  const [ttsLang, setTtsLang] = useState("ru-RU");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      // Запрос разрешения на камеру
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        Alert.alert(
          "Нет доступа к камере",
          "Пожалуйста, разрешите доступ к камере в настройках устройства."
        );
        setHasPermission(false);
        return;
      }
      setHasPermission(true);

      // Запрос разрешения на медиа-библиотеку
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== "granted") {
        Alert.alert(
          "Нет доступа к галерее",
          "Пожалуйста, разрешите доступ к фото и видео в настройках устройства."
        );
        setMediaPermission(false);
      } else {
        setMediaPermission(true);
      }

      // Загрузка языка озвучки
      const lang = await AsyncStorage.getItem("ttsLang");
      if (lang) setTtsLang(lang);
    })();
  }, []);

  const handleTakePhotoAndDescribe = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    setDescription("");
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      const prompt =
        "Опиши, что изображено на фото, кратко и понятно для туриста. Ответь на языке: " +
        (ttsLang === "ru-RU"
          ? "русский"
          : ttsLang === "en-US"
          ? "английский"
          : "казахский");

      const geminiRequest = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: photo.base64,
                },
              },
            ],
          },
        ],
      };

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiRequest),
      });

      const data = await res.json();
      const desc =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "Нет описания";
      setDescription(desc);
      Speech.speak(desc, { language: ttsLang });
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось получить описание объекта");
    }
    setLoading(false);
  };

  const handleSelfieAndShare = async () => {
    if (!cameraRef.current) return;
    try {
      const selfie = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      // Сохраняем фото в галерею (чтобы можно было поделиться)
      const asset = await MediaLibrary.createAssetAsync(selfie.uri);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(asset.uri);
      } else {
        Alert.alert("Ошибка", "Функция \"Поделиться\" недоступна на этом устройстве");
      }
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось сделать селфи или поделиться");
    }
  };

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Нет доступа к камере</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasPermission && (
        // @ts-ignore
        <Camera
          // @ts-ignore
          style={styles.camera}
          ref={cameraRef}
          ratio="16:9"
        />
      )}
      <View style={styles.bottomPanel}>
        <Button
          title="Сделать фото и получить описание"
          onPress={handleTakePhotoAndDescribe}
          disabled={loading}
        />
        <Button
          title="🤳 Поделиться с друзьями"
          onPress={handleSelfieAndShare}
          disabled={loading || !mediaPermission}
        />
        {loading && <ActivityIndicator size="small" color="#1976D2" />}
        {description ? <Text style={styles.desc}>{description}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F9FF" },
  camera: { flex: 1 },
  bottomPanel: { padding: 16, backgroundColor: "#fff" },
  desc: { marginTop: 12, color: "#1976D2", fontSize: 16, fontWeight: "bold" },
  error: { color: "red", fontSize: 18, textAlign: "center", marginTop: 40 },
});
