FROM python:3.10

WORKDIR /ml
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "detect.py"]
# Expose port 8000 for the application
# EXPOSE 8000
# If you want to run the application with uvicorn, uncomment the following line
# CMD ["uvicorn", "app.main:app", "--host", "   