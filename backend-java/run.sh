#!/bin/bash

# FinLedger Spring Boot Backend Startup Script

echo "Starting FinLedger Spring Boot Backend..."

# Check if Java 17 is available
if ! command -v java &> /dev/null; then
    echo "Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "Java 17 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Warning: DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL to your PostgreSQL connection string"
    exit 1
fi

# Check if REPL_ID is set
if [ -z "$REPL_ID" ]; then
    echo "Warning: REPL_ID environment variable is not set"
    echo "Please set REPL_ID for OAuth authentication"
    exit 1
fi

# Make mvnw executable
chmod +x ./mvnw

# Clean and install dependencies
echo "Installing dependencies..."
./mvnw clean install -DskipTests

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

# Start the application
echo "Starting Spring Boot application on port 8080..."
./mvnw spring-boot:run