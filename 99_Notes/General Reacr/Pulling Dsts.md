Wade-usa.com

Custom Gem

Show thinking

To pull data from Directus using Axios in your React frontend, you'll make HTTP GET requests to Directus's REST API endpoints. You can leverage the `directusApi` instance you already have set up in your `AuthContext.jsx`, which is pre-configured with your base URL and authentication interceptors.

Here's a step-by-step guide with a React component example:

### **Step 1: Access Your `directusApi` Instance**

Make sure you have access to your `directusApi` instance (the Axios instance configured with your Directus base URL and interceptors). This is often done by either exporting it directly from your `AuthContext.jsx` or by creating a separate utility file for your Axios client.

For simplicity and to maintain context:

JavaScript

```
// A simple way to get access to your configured directusApi instance
// You might put this in a file like services/directus.js or similar
// and then import it into your React components.

import axios from 'axios';

// Ensure this baseURL matches what you have in your AuthContext's directusApi instance
const DIRECTUS_BASE_URL = import.meta.env.VITE_APP_API_URL; 

const directusApi = axios.create({
    baseURL: DIRECTUS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // If your Directus uses HTTP-only cookies for refresh tokens
});

// Assuming your AuthContext.jsx already has request/response interceptors for authentication
// If not, you'd need to add them here or ensure AuthContext exports this configured instance.
```

### **Step 2: Fetch Data in a React Component**

You'll typically use the `useState` hook to store the fetched data and the `useEffect` hook to perform the data fetching when the component mounts.

Let's assume you want to fetch items from a Directus collection named `trips` (which would hold your `trip_title`, `summary`, etc.).

JavaScript

```
import React, { useState, useEffect } from 'react';
// Assuming directusApi is exported from a central place like an API service file
// For example: import { directusApi } from '../../services/directusApi'; // Adjust path
// Or if you only use it within AuthContext, you might need to reconsider your client setup
// For this example, we'll assume directusApi is importable directly.
// In practice, you might refactor your AuthContext to export this instance.
import { directusApi } from '../../0_Contexts/AuthContext'; // <-- Assuming directusApi is exported from your AuthContext file

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Directus REST API endpoint for fetching items from a collection: /items/{collection_name}
        // Example: Fetch all trips, ordering by created date descending, and include image details
        const response = await directusApi.get('/items/trips', {
          params: {
            fields: 'id,trip_title,summary,image,created,auther,traveled,status', // Specify fields to retrieve
            sort: '-created', // Sort by 'created' field in descending order (newest first)
            // filter: { status: { _eq: 'planning' } }, // Example: Only fetch items where status is 'planning'
            // limit: 10, // Example: Limit results to 10 items
          },
        });

        // Directus API responses typically have data in response.data.data
        setTrips(response.data.data);
      } catch (err) {
        console.error('Error fetching trips from Directus:', err);
        setError('Failed to load trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array means this effect runs only once after the initial render

  if (loading) {
    return <div>Loading trips...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h1>My Travel Trips</h1>
      {trips.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              <h3>{trip.trip_title}</h3>
              <p>{trip.summary}</p>
              <p>Created: {trip.created}</p>
              {/* Assuming trip.image contains the Directus file ID */}
              {trip.image && (
                <img
                  src={`${directusApi.defaults.baseURL}/assets/${trip.image.id}?width=300`} // Example with image ID and transformation
                  alt={trip.trip_title}
                  style={{ maxWidth: '100px', height: 'auto' }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TripList;
```

### **Key Concepts:**

- **`directusApi.get('/items/{collection_name}')`**: This is the standard endpoint to retrieve items from a Directus collection. Replace `{collection_name}` with the actual name of your collection (e.g., `trips`, `roadbook_entries`).
- **`params` object**: You can pass an object named `params` to the Axios `get` request. Axios will automatically append these as URL query parameters to your Directus API call. Common parameters include:
    - `fields`: A comma-separated list of fields you want to retrieve (e.g., `fields=id,trip_title,summary`). Use `*` for all fields, or `image.*` to get all sub-fields of a relational field like `image`.
    - `sort`: Fields to sort by (e.g., `sort=created` for ascending, `sort=-created` for descending).
    - `filter`: For complex filtering based on field values.
    - `limit`, `offset`: For pagination.
- **`response.data.data`**: Directus API responses for item retrieval wrap the actual data you want in a `data` property, which is itself inside the main `response.data` object.
- **`useEffect([], ...)`**: Ensures the data fetching happens once when the component mounts.
- **Error Handling and Loading States**: Essential for a good user experience.

This setup will allow you to dynamically pull and display your data from Directus into your React frontend.4

&nbsp;
