FROM node:18-alpine AS frontend-build
WORKDIR /app

COPY my-project/package*.json ./my-project/
RUN cd my-project && npm ci

COPY my-project ./my-project
RUN cd my-project && npm run build

FROM python:3.11-slim AS backend-build
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
RUN mkdir -p /app/app/uploads  

COPY --from=frontend-build /app/my-project/dist ./static

RUN mkdir -p /app/app/data

RUN python app/create_db.py

FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --from=backend-build /app /app

ENV PYTHONPATH=/app/app

EXPOSE 8000
CMD ["sh", "-c", "\
    python app/create_db.py && \
    python app/seed_data.py && \
    uvicorn app.main:app --host 0.0.0.0 --port 8000\
"]
