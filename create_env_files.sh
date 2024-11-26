#!/bin/sh

# Create .env file for the backend
cat <<EOF > /backend/.env
MAILGUN_API_KEY=${MAILGUN_API_KEY}
MAILGUN_DOMAIN=${MAILGUN_DOMAIN}
EOF

# Create .env file for the frontend
cat <<EOF > /frontend/.env
EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}
EOF
