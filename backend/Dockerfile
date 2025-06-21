# Используем официальный Python-образ
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы
COPY . .

# Устанавливаем зависимости
RUN pip install --upgrade pip \
 && pip install -r requirements.txt

# Запускаем сервер
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
