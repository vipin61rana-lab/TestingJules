# SmartClaims360

This is a Spring Boot application for managing claims.

## Prerequisites

- Java 17 (Temurin JDK)
- Maven

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

## Running the application

You can run the application using the following Maven command:

```bash
mvn spring-boot:run
```

The application will start on port 8080.

**Note:** The application is pre-populated with 5 sample claims for testing and demonstration purposes. You can retrieve them by calling the `GET /api/v1/claims` endpoint.

## Web Interface

A simple web interface is available to view and create claims. Once the application is running, you can access it at:

[http://localhost:8080/index.html](http://localhost:8080/index.html)

## API Documentation

The API documentation is available through Swagger UI. Once the application is running, you can access it at:

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Health Check

- **URL:** `/health`
- **Method:** `GET`
- **Response:** `SmartClaims360 API is running`

### Claims

#### Create a new claim

- **URL:** `/claims`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "claimantName": "John Doe",
    "claimAmount": 100.50,
    "claimType": "AUTO"
  }
  ```
- **Example:**
  ```bash
  curl -X POST http://localhost:8080/api/v1/claims \
  -H "Content-Type: application/json" \
  -d '{
    "claimantName": "John Doe",
    "claimAmount": 100.50,
    "claimType": "AUTO"
  }'
  ```

#### Get all claims

- **URL:** `/claims`
- **Method:** `GET`
- **Example:**
  ```bash
  curl http://localhost:8080/api/v1/claims
  ```

#### Get claim by ID

- **URL:** `/claims/{id}`
- **Method:** `GET`
- **Example:**
  ```bash
  curl http://localhost:8080/api/v1/claims/<claim-id>
  ```
