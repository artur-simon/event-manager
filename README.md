# Event Manager

## Overview

**Event Manager** is a full-stack web application for managing events. It allows users to create, list, edit, and delete events. The project is divided into a backend (Java Spring Boot) and a frontend (React + Vite), with Docker support.

---

## 1. Run the Application

### Prerequisites

- **Node.js**
- **Java 24**
- **Maven**
- **Docker**

---

### Hibernate DDL Auto Configuration

* To generate tables on first application run (without recreating them on subsequent runs), configure `spring.jpa.hibernate.ddl-auto` in `application.properties` as follows:

  **Initial run:**

  ```
  spring.jpa.hibernate.ddl-auto=create
  ```

  **After:**

  ```
  spring.jpa.hibernate.ddl-auto=none  (or validate)
  ```

Though this is not recommended to use on production databases, instead we could migrate the behaviour to tools like Flyway or Liquibase.

### Running with Docker (Recommended)

1. **Build and Start All Services**

   In the project root, run:
   ```
   mvn package
   docker compose up --build
   ```
   This will:
   - Build and run the backend (Java Spring Boot + Maven)
   - Build and run the frontend (React + Vite)
   - Start a PostgreSQL database

2. **Access the Application**
   - Frontend: [http://localhost:5173](http://localhost:5173) (default Vite port)
   - Backend API: [http://localhost:8080/events](http://localhost:8080/events)
   - PostgreSQL: exposed on default port 5432 (see `compose.yaml` for placeholder credentials)

---

### Running Manually (Without Docker)

#### Backend

1. **Configure Database**
   - Edit `backend/src/main/resources/application-local.properties` with your PostgreSQL specifications.

2. **Start PostgreSQL**

3. **Run the Backend**
   ```
   cd backend
   ./mvnw spring-boot:run -D"spring-boot.run.profiles=local"
   ```
   The backend will be available at `http://localhost:8080`.

#### Frontend

1. **Install Dependencies**
   ```
   cd frontend
   npm install
   ```

2. **Start the Frontend**
   ```
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

3. **API Proxy**
   - The frontend is configured (via `vite.config.ts`) to proxy `/events` requests to the backend at `http://localhost:8080`.

---

## 2. Technical Decisions

### Backend

- **Language/Framework:** Java 24, Spring Boot
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA / Hibernate
- **API:** RESTful endpoints for event CRUD (`/events`)
- **Exception Handling:** Global exception handler

### Frontend

- **Framework:** React (Created via Vite as per this year's deprecation of create-react-app)
- **HTTP Client:** Axios (Chosen for its simplicity, compared to Fetch or more complex clients (React Query), allowed fast implementation with the built-in JSON transformation and error handling.
- **Styling:** Pure CSS (Selected to avoid additional setup, given the deadline constraints, despite being a more crude approach than styled-components, or Tailwind.)
- **State Management:** React hooks (`useState`, `useEffect`)

### Dev/Build Tools

- **Docker & Docker Compose:** The implementation began with containerizing all core components (backend, frontend, database) to ensure consistency. The setup was designed to be minimal and intuitive: a single docker compose up --build command launches the stack without individual configuration. This also provides a clean interface for future CI/CD integration (originally planned but deprioritized due to time contraints)
- **Vite Proxy:** Used in development to avoid CORS and simplify API calls, again simplified for delivery on schedule

---

## 3. Application Functionality

- **Event CRUD:** Create, list, edit, and delete events
- **Form Validation:** Required fields, proper types
- **Feedback:** Visual feedback for loading, success, and error states
- **UI:** Clean, straightforward, responsive

---

## 4. Docker Usage

- **compose.yaml** orchestrates:
  - **Backend** (builds with Maven, runs Spring Boot)
  - **Frontend** (builds with Node, runs Vite dev server)
  - **PostgreSQL** (uses an official image, is created in a persistent volume)
- **Environment Variables:** Database credentials and connection URLs are set via Docker Compose environment variables and passed to the backend. All services are on the same Docker defined network

**Steps:**
1. `mvn package` builds the backend application .jar that will be copied to docker
2. `docker compose up --build` to build and serve the projects.
3. Access the app at [http://localhost:5173](http://localhost:5173).

---

## 5. Environment Variables

- **Backend:** Uses `application-local.properties` and Docker Compose envs for DB connection.
- **Frontend:** Use `.env` with `VITE_API_URL` for API base URL in production. In development, Vite proxy handles API routing.

---

## 9. Useful Commands

- **Build and run everything with Docker:**  
  `docker compose up --build`
- **Stop all containers:**  
  `docker compose down` (add -v to clean the volumes)
- **Run backend only:**  
  `./mvnw spring-boot:run` (in `backend/`)
- **Run frontend only:**  
  `npm run dev` (in `frontend/`)