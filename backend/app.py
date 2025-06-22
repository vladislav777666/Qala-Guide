import os
import base64
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

GEMINI_API_KEY = "ВАШ_GEMINI_API_KEY"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key={GEMINI_API_KEY}"

@app.route('/describe', methods=['POST'])
def describe():
    data = request.get_json()
    image_b64 = data['image']
    lang = data.get('lang', 'ru-RU')
    prompt = "Опиши, что изображено на фото, кратко и понятно для туриста. Ответь на языке: " + ("русский" if lang == "ru-RU" else "английский" if lang == "en-US" else "казахский")

    gemini_request = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_b64
                        }
                    }
                ]
            }
        ]
    }

    response = requests.post(
        GEMINI_URL,
        headers={"Content-Type": "application/json"},
        json=gemini_request
    )
    if response.status_code != 200:
        return jsonify({"description": "Ошибка обращения к Gemini"}), 500

    data = response.json()
    description = (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "Нет описания")
    )
    return jsonify({"description": description})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)