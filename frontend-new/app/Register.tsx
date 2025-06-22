import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { supabase } from "../supabaseClient";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Проверьте почту для подтверждения");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Пароль" secureTextEntry onChangeText={setPassword} />
      <Button title="Регистрация" onPress={handleRegister} />
      {message && <Text>{message}</Text>}
    </View>
  );
}
