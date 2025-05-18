# API Documentation: Countdown Routes

**File:** `server/routes/countDown.js`

**Base Path:** `/api/countdown`
*(This router is mounted at `/api/countdown` in the main `server.js` file: `app.use('/api/countdown', countdownRoutes)`)*

## Overview

This module defines the API endpoints for managing countdown items. It handles operations such as fetching all countdowns, adding a new countdown, deleting an existing one, and editing a countdown. It interacts with a PostgreSQL database via the imported `db` connection module.

## Dependencies

-   `express`: Web framework for Node.js. Used to create the router and define routes.
-   `../config/db.js`: Custom database connection module used for executing SQL queries against the PostgreSQL database.

## Database Table Assumption

These routes assume a PostgreSQL table named `public.countdown` with at least the following columns:

-   `id`: (e.g., `INTEGER` or `BIGINT`, likely a `PRIMARY KEY`) - Used to uniquely identify a countdown. The current `/add` route expects this to be provided by the client.
-   `title`: (e.g., `VARCHAR(255)` or `TEXT`) - The title or name of the countdown event.
-   `date`: (e.g., `TIMESTAMP` or `TIMESTAMPTZ` or `VARCHAR(255)`) - The target date and time for the countdown. The client sends this as a string (e.g., "YYYY-MM-DDTHH:MM").

## Routes

---

### 1. Fetch All Countdown Items

* **Endpoint:** `GET /`
    *(Full path: `/api/countdown/`)*
* **Description:** Retrieves all existing countdown items from the `public.countdown` table in the database.
* **Request Body:** None.
* **Success Response:**
    * **Status:** `200 OK`
    * **Body (JSON Array):** An array of countdown objects. Each object contains all columns from the `public.countdown` table for that item.
        ```json
        [
          { "id": 1, "title": "My Birthday", "date": "2026-04-25T00:00:00Z" },
          { "id": 2, "title": "New Year", "date": "2025-12-31T23:59:00Z" }
        ]
        ```
* **Error Response:**
    * If there's a database error, an error message is logged to the server console. The client might receive a default Express error or the request might hang if no response is explicitly sent from the catch block. *(Improvement: Send a `500 Internal Server Error` with a JSON message).*

---

### 2. Add a New Countdown Item

* **