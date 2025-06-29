# Qala-Guide
Интерактивный AR‑гид по Астане на React Native + FastAPI: распознавание POI в камере, голосовые подсказки (TTS), мультиязычие (KK/RU/EN), персональные и популярные маршруты.

# – AR/AI-гид по Астане 🇰🇿

**Qala Guide** — кроссплатформенное приложение дополненной реальности (AR), которое помогает туристам исследовать Астану, используя камеру, GPS и ИИ. Узнавайте достопримечательности, получайте голосовые описания на казахском, русском и английском языках, проходите персональные маршруты и делитесь впечатлениями.

---

## ✨ Возможности

- 📍 Распознавание достопримечательностей через камеру и GPS
- 🎧 Озвучка описаний на трех языках (KK / RU / EN)
- 🗺️ Популярные и персонализированные маршруты
- 🧠 Рекомендательная система на основе интересов
- 🗣️ Обратная связь с анализом отзывов (sentiment analysis)
- 🔊 Подсказки при прогулке
- 📊 Тепловые карты туристических потоков

---

## 🛠️ Технологии

| Слой              | Стек / Технологии                                  |
|-------------------|-----------------------------------------------------|
| Мобильное приложение | React Native / Flutter, ARCore / ARKit              |
| AR + GPS + UI     | Mapbox SDK / OpenStreetMap, Camera API              |
| Бэкенд            | FastAPI (Python), PostgreSQL + PostGIS              |
| ML/AI             | YOLOv5-lite, Llama/Mistral, Coqui TTS / Azure TTS   |
| Перевод           | Hugging Face Transformers (MarianMT / M2M100)       |
| Аутентификация    | Firebase Auth / Supabase                            |
| Хранилище         | Supabase Storage / Firebase                         |
| Аналитика         | Metabase / PostHog / Grafana                        |

---

## 📁 Структура проекта

```plaintext
qala-guide/
├── frontend/         # Приложение (React Native / Flutter)
├── backend/          # FastAPI сервер
├── ml/               # Детекция POI, генерация текста, TTS
├── shared/           # Конфиги, общие данные, mock-POI
├── scripts/          # Деплой, импорт POI и пр.
├── docker-compose.yml
└── README.md


🔒 Лицензия
Этот проект распространяется под лицензией MIT License.

👨‍💻 Команда
Владислав — разработка, архитектура

Ильяс — TBD (маркетинг / UX / исследование)

Аяжан — TBD (дизайн / тексты / маршруты)

📩 Связь
Хочешь предложить партнёрство, стать бета-тестером или помочь проекту?
Свяжись с нами в телеграмм: https://t.me/Geniys666
