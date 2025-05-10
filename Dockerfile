# step 1, build frontend
    FROM node:18-alpine AS frontend-build
    WORKDIR /app
    
    COPY my-project/package*.json ./my-project/
    RUN cd my-project && npm ci
    
    COPY my-project ./my-project
    RUN cd my-project && npm run build
    
# step 2, build backend
    FROM python:3.11-slim AS backend-build
    WORKDIR /app
    
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    
    COPY backend/app ./app
    COPY --from=frontend-build /app/my-project/dist ./static
    
    RUN mkdir -p /app/app/data
    
    RUN python app/create_db.py
    
# step 3, runtime image
    FROM python:3.11-slim
    WORKDIR /app
    
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    
    COPY --from=backend-build /app /app
    
    ENV PYTHONPATH=/app/app
    
    EXPOSE 8000
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    