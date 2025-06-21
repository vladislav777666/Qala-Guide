run-backend:
	cd backend && uvicorn app.main:app --reload

install-backend:
	cd backend && pip install -r requirements.txt

run-frontend:
	cd frontend && npx expo start

install-frontend:
	cd frontend && npm install

lint:
	black backend/app
