import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL || "http://10.0.2.2:8000"; // Android emulator

export async function getNearbyPOIs(lat: number, lon: number) {
  const res = await axios.get(`${BASE_URL}/poi/nearby`, {
    params: { lat, lon },
  });
  return res.data;
}
