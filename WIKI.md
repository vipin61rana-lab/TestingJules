# SmartClaims360 Application Wiki

This document provides a comprehensive overview of the SmartClaims360 application, including its functionality, architecture, and how to run it locally.

## Table of Contents
1.  [Overview](#1-overview)
2.  [Technologies Used](#2-technologies-used)
3.  [Project Structure](#3-project-structure)
4.  [How to Run the Application](#4-how-to-run-the-application)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
5.  [Backend Details](#5-backend-details)
    - [Entities](#entities)
    - [API Endpoints](#api-endpoints)
    - [Security](#security)
6.  [Frontend Details (React UI)](#6-frontend-details-react-ui)
    - [Core Concepts](#core-concepts)
    - [Folder Structure](#folder-structure)
    - [Page Components](#page-components)
    - [Shared Components](#shared-components)

---

## 1. Overview

SmartClaims360 is a web application for managing insurance claims. It consists of a Spring Boot backend providing a REST API and a modern frontend built as a Single-Page Application (SPA) using React.js.

The application supports role-based access control (Admin vs. User) and provides features for creating, viewing, updating, and deleting claims, as well as a multi-step wizard for detailed claim processing.

---

## 2. Technologies Used

- **Backend:**
  - Java 17
  - Spring Boot 3
  - Spring Web, Spring Security, Spring Data JPA
  - Maven
  - H2 In-Memory Database
  - JJWT for JSON Web Token management
  - SpringDoc OpenAPI for Swagger UI

- **Frontend:**
  - React.js 19
  - React Router for client-side navigation
  - Axios for API communication
  - jwt-decode for parsing JWTs
  - CSS3 for styling
  - NPM for package management

---

## 3. Project Structure

The project is a monorepo containing two main parts: the Spring Boot backend and the React frontend.

- `pom.xml`: Defines backend dependencies and build configurations.
- `src/`: Contains the core backend Java source code and resources.
- `smartclaims-ui/`: Contains the entire React.js frontend application.
  - `package.json`: Defines frontend dependencies and scripts.
  - `public/`: Contains the base `index.html` file and static assets.
  - `src/`: Contains the React application source code.

---

## 4. How to Run the Application

### Development Mode

For development, the backend and frontend are run as two separate servers.

**1. Run the Backend (API Server):**
- Open a terminal in the project root (where `pom.xml` is).
- Run the command: `mvn spring-boot:run`
- The backend will start on `http://localhost:8080`.

**2. Run the Frontend (React Dev Server):**
- Open a **second, separate terminal**.
- Navigate into the UI directory: `cd smartclaims-ui`
- Install dependencies: `npm install`
- Start the server: `npm start`
- The frontend will open in your browser at `http://localhost:3000`.

The React app is configured to proxy API requests to the backend on port 8080, so there are no CORS issues.

### Production Mode

To run the application as a single, unified artifact:
1.  In the `smartclaims-ui` directory, run `npm run build`. This creates an optimized, static version of the UI in the `smartclaims-ui/build` folder.
2.  Delete the contents of the `src/main/resources/static` folder in the Spring Boot project.
3.  Copy the contents of the `smartclaims-ui/build` folder into the `src/main/resources/static` folder.
4.  Now, when you run the backend with `mvn spring-boot:run`, it will serve the React application directly from `http://localhost:8080`.

---

## 5. Backend Details

### Entities
- **`User`**: Represents a user account (`vipin`, `rahul`).
- **`Client`**: Represents an insurance client.
- **`Claim`**: Represents an insurance claim, linked to a `Client`.

### API Endpoints
All endpoints are prefixed with `/api/v1`.
- `POST /auth/login`: Authenticates a user and returns a JWT.
- `GET /admin/users`: (ADMIN) Gets all users.
- `POST /admin/users`: (ADMIN) Creates a new user.
- `GET, POST, PUT, DELETE /claims`: Standard CRUD operations for the main dashboard.
- `POST /processing/client`: Starts a new claim processing flow.
- `PUT, GET /processing/claim/{id}`: Continues the claim processing flow.
- `POST /processing/submit/{id}`: Submits the claim.

### Security
- JWT-based authentication protects all endpoints except `/login`.
- Role-based authorization restricts `/admin/**` endpoints to users with `ROLE_ADMIN`.

---

## 6. Frontend Details (React UI)

The frontend is a Single-Page Application built with React.

### Core Concepts
- **Routing:** `react-router-dom` is used to manage navigation between pages without a full browser refresh.
- **Authentication:** A `ProtectedRoute` component wraps secure pages. It checks for a valid JWT in `localStorage` via the `AuthContext`. If the token is missing or invalid, it redirects the user to the login page.
- **State Management:** Global authentication state (the user object and JWT) is managed by `AuthContext`. Local component state is managed with `useState` and `useEffect` hooks.
- **API Communication:** All HTTP requests to the backend are centralized in `apiService.js`, which uses `axios`. An `axios` interceptor automatically attaches the JWT to the `Authorization` header of every request.

### Folder Structure
- `smartclaims-ui/src/`
  - `components/`: Contains reusable components shared across multiple pages (e.g., `Header.js`, `ProgressBar.js`).
  - `context/`: Holds React Context providers (e.g., `AuthContext.js`).
  - `pages/`: Contains top-level components that represent a full page/view (e.g., `LoginPage.js`, `DashboardPage.js`).
  - `services/`: Contains modules for external communication (e.g., `apiService.js`).

### Page Components
- **`LoginPage.js`**: Provides a login form. On success, it saves the JWT and redirects to the dashboard.
- **`DashboardPage.js`**: The main screen. Displays a list of claims with search, create, edit, and delete functionality.
- **`AdminPage.js`**: An admin-only page for managing users. Includes a "Back to Dashboard" button for easy navigation.
- **`ClaimProcessingPage.js`**: A multi-step wizard for submitting a detailed claim. It manages the flow between the different steps and includes a "Back to Dashboard" button.

### Shared Components
- **`Header.js`**: The main application header, which displays the user's name and provides navigation links (e.g., "Admin", "Process a Claim") based on the user's role. Also contains the logout button.
- **`ProgressBar.js`**: A visual component used in the `ClaimProcessingPage` to show the user's progress through the steps.
- **Step Components** (`ClientInfoStep`, `ClaimDetailsStep`, etc.): Each component in the claim processing wizard is a self-contained form responsible for its own state and data submission.
