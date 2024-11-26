# Backend testing stage
FROM python:3.9-slim AS backend

# Set the working directory
WORKDIR /backend

# Copy the backend code
COPY Backend/ .

# Install the backend dependencies
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt

# Expose the backend port
EXPOSE 8000

# Frontend testing stage
FROM node:16 AS frontend

# Set the working directory
WORKDIR /frontend

# Copy the frontend code
COPY app/ .

# Install the frontend dependencies
RUN npm install

# Expose the frontend port
EXPOSE 8081

# Final combination stage
FROM python:3.9-slim

# Install Node.js in the final stage
RUN apt-get update && apt-get install -y nodejs npm

# Copy the backend from the backend stage
COPY --from=backend /backend /backend

# Copy the frontend from the frontend stage
COPY --from=frontend /frontend /frontend

# Set the working directory for the final container
WORKDIR /frontend

# Install the frontend dependencies in the final stage
RUN cd /frontend && npm install

# Expose the necessary ports
EXPOSE 8000
EXPOSE 8081

# Script to create .env files
COPY create_env_files.sh /usr/local/bin/create_env_files.sh
RUN chmod +x /usr/local/bin/create_env_files.sh

# Start both backend and frontend
CMD ["sh", "-c", "/usr/local/bin/create_env_files.sh && cd /backend && . venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 & cd /frontend && npm start"]
