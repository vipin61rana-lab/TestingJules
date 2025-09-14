# SmartClaims360 Application Wiki

This document provides a comprehensive overview of the SmartClaims360 application, including its functionality, architecture, and how to run it locally.

## Table of Contents
1.  [Overview](#1-overview)
2.  [Technologies Used](#2-technologies-used)
3.  [Project Structure](#3-project-structure)
4.  [How to Run the Application](#4-how-to-run-the-application)
5.  [Backend Details](#5-backend-details)
    - [Entities](#entities)
    - [Repositories](#repositories)
    - [Services](#services)
    - [API Endpoints](#api-endpoints)
    - [Security Configuration](#security-configuration)
6.  [Frontend Details](#6-frontend-details)
    - [Login Page (`login.html`)](#login-page-loginhtml)
    - [Main Claims Dashboard (`index.html`)](#main-claims-dashboard-indexhtml)
    - [Admin Page (`admin.html`)](#admin-page-adminhtml)
    - [Claim Processing Page (`processing.html`)](#claim-processing-page-processinghtml)

---

## 1. Overview

SmartClaims360 is a web application designed for managing insurance claims. It provides functionalities for users to view, create, and manage claims. It features a role-based access control system with regular users and administrators. A key feature is a multi-step claim processing screen that guides users through submitting detailed claims.

---

## 2. Technologies Used

- **Backend:**
  - Java 17
  - Spring Boot 3
  - Spring Web (for REST APIs)
  - Spring Security (for authentication and authorization)
  - Spring Data JPA (for database interaction)
  - Maven (for dependency management)
  - JJWT (for JSON Web Token generation and validation)
- **Database:**
  - H2 In-Memory Database
- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- **API Documentation:**
  - SpringDoc OpenAPI (Swagger UI)

---

## 3. Project Structure

The project follows a standard Maven project structure.

- `pom.xml`: Defines all project dependencies and build configurations.
- `src/main/java/com/smartclaims/smartclaims360/`: Contains the core backend Java source code.
  - `config/`: Spring configuration classes (e.g., `SecurityConfig`, `DataSeeder`).
  - `controller/`: Spring MVC REST controllers that handle API requests.
  - `dto/`: Data Transfer Objects used for API request/response bodies.
  - `entity/`: JPA entities that map to database tables.
  - `repository/`: Spring Data JPA repository interfaces.
  - `service/`: Service layer containing business logic.
  - `util/`: Utility classes, such as `JwtUtil`.
- `src/main/resources/`:
  - `application.properties`: Main application configuration.
  - `static/`: Contains all frontend assets (HTML, CSS, JavaScript).
- `src/test/java/`: Contains all unit and integration tests for the application.

---

## 4. How to Run the Application

### Prerequisites
- Java 17 JDK
- Apache Maven

### Steps
1.  **Clone the repository.**
2.  **Build the project:** Open a terminal in the project root and run:
    ```bash
    mvn clean install
    ```
3.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```
4.  The application will start on `http://localhost:8080`.

### Accessing the Application
- **Main Page:** `http://localhost:8080` (will redirect to `login.html` if not authenticated)
- **Swagger API Docs:** `http://localhost:8080/swagger-ui/index.html`

### Default Users
The application is seeded with two default users:
- **Admin User:**
  - Username: `vipin`
  - Password: `password`
- **Regular User:**
  - Username: `rahul`
  - Password: `password`

---

## 5. Backend Details

### Entities

- **`User.java`**: Represents a user account.
  - `id` (UUID)
  - `username` (String)
  - `password` (String, encoded)
  - `roles` (String, comma-separated, e.g., "ROLE_ADMIN,ROLE_USER")

- **`Client.java`**: Represents an insurance client.
  - `id` (UUID)
  - `fullName` (String)
  - `address` (String)
  - `phoneNumber` (String)
  - `email` (String)

- **`Claim.java`**: Represents an insurance claim.
  - `id` (UUID)
  - `client` (Many-to-One relationship with `Client`)
  - `claimantName` (String)
  - `claimAmount` (BigDecimal)
  - `claimType` (String)
  - `description` (String)
  - `dateOfIncident` (LocalDate)
  - `status` (String, e.g., "DRAFT", "NEW", "SUBMITTED")
  - `createdAt` (LocalDateTime)

### Repositories
- `UserRepository`: For `User` entity CRUD operations.
- `ClientRepository`: For `Client` entity CRUD operations.
- `ClaimRepository`: For `Claim` entity CRUD operations.

### Services
- **`CustomUserDetailsService`**: Loads user-specific data for Spring Security.
- **`ClaimService`**: Handles the business logic for the basic CRUD operations on the main claims dashboard.
- **`ClaimProcessingService`**: Manages the logic for the new multi-step claim submission flow.

### API Endpoints

#### Authentication (`AuthController`)
- `POST /api/v1/auth/login`: Authenticates a user and returns a JWT.

#### Admin (`AdminController`)
- `GET /api/v1/admin/users`: (ADMIN only) Retrieves a list of all users.
- `POST /api/v1/admin/users`: (ADMIN only) Creates a new user.

#### Claims (`ClaimController`)
- `GET /api/v1/claims`: Gets a list of all claims.
- `POST /api/v1/claims`: Creates a new claim (from the main dashboard).
- `GET /api/v1/claims/{id}`: Gets a specific claim by ID.
- `PUT /api/v1/claims/{id}`: Updates a claim.
- `DELETE /api/v1/claims`: Deletes a list of claims by their IDs.

#### Claim Processing (`ClaimProcessingController`)
- `POST /api/v1/processing/client`: **Step 1:** Saves new client info and creates a draft claim. Returns the `claimId`.
- `PUT /api/v1/processing/claim/{claimId}`: **Step 2:** Updates the draft claim with more details.
- `GET /api/v1/processing/claim/{claimId}`: **Step 3:** Fetches all claim and client data for review.
- `POST /api/v1/processing/submit/{claimId}`: **Step 4:** Finalizes the claim by changing its status to "SUBMITTED".

### Security Configuration
- JWT-based authentication is used for all API endpoints except login.
- Endpoints under `/api/v1/admin/**` are restricted to users with the `ROLE_ADMIN`.
- All other API endpoints require at least `ROLE_USER`.
- Static resources like HTML, CSS, and JS are publicly accessible.

---

## 6. Frontend Details

### Login Page (`login.html`)
- A simple form to enter username and password.
- On successful login, it calls the `/api/v1/auth/login` endpoint, stores the received JWT in `localStorage`, and redirects to `index.html`.

### Main Claims Dashboard (`index.html`)
- The main landing page for authenticated users.
- **Displays a table of all claims.**
- **Search:** A search bar allows real-time filtering of the claims table.
- **Create Claim:** A simple form to create a new claim.
- **Edit Claim:** An "Edit" button on each row allows for inline editing of claim details.
- **Bulk Delete:** Checkboxes allow for selecting multiple claims to delete.
- **Conditional Links:**
  - The **"Admin"** link is only visible to users with the `ROLE_ADMIN`.
  - The **"Process a Claim"** link is visible to all logged-in users.

### Admin Page (`admin.html`)
- Accessible only to admin users.
- Displays a list of all registered users.
- Provides a form to create new users with specific roles.

### Claim Processing Page (`processing.html`)
- A multi-step wizard for submitting a detailed claim.
- **Progress Bar:** Visually indicates the user's progress through the four steps.
- **Step 1: Client Info:** Collects the client's full name, address, phone, and email. The "Next" button saves this data and creates a new draft claim.
- **Step 2: Claim Details:** Collects the date of the incident, claim type, amount, and a description.
- **Step 3: Review:** Displays all the information entered in the previous steps for the user to review.
- **Step 4: Submit:** A final confirmation step. Clicking "Submit Claim" sends the claim for processing.
