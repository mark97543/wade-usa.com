## Component: WeatherWidget.jsx

### Purpose

The `WeatherWidget` component is responsible for fetching and displaying current weather information for a specified location. It allows users to input a location and view details such as temperature, conditions, and the city name. This widget is designed to be used within the user dashboard.

### Props

| Prop              | Type   | Required | Default Value        | Description                                                                 |
|-------------------|--------|----------|----------------------|-----------------------------------------------------------------------------|
| `defaultLocation` | String | No       | `"Ammon, ID"` (example) | The initial location for which to fetch and display weather upon rendering. |
| `apiEndpoint`     | String | No       | `"/api/weather"`     | The backend API endpoint to fetch weather data from.                        |

*(Note: Adjust `defaultLocation` and `apiEndpoint` defaults based on your actual implementation.)*

### State

* `weatherData` (Object | null): Stores the structured weather information fetched from the API (e.g., temperature, description, icon URL, city name). Initialized to `null`.
* `location` (String): The current location for which weather is being fetched or displayed.
* `inputLocation` (String): The value of the location input field controlled by the user.
* `loading` (Boolean): Indicates whether weather data is currently being fetched. `true` during API calls, `false` otherwise.
* `error` (String | null): Stores any error message if fetching data fails. Initialized to `null`.

### Key Functionality & Logic

1.  **Initial Weather Fetch:**
    * On component mount, if a `location` (initially from `defaultLocation` prop) is set, it automatically fetches the weather for that location.
2.  **User Input for Location:**
    * Provides an input field for the user to type a new city name or location.
    * A submit button triggers a new weather data fetch for the user-provided location.
3.  **API Interaction:**
    * Makes an asynchronous request (e.g., using `Workspace` or `axios`) to the backend `apiEndpoint` (e.g., `/api/weather?location=<LOCATION_NAME>`).
    * The backend is assumed to handle the actual communication with an external weather API and manage any necessary API keys.
4.  **Data Display:**
    * If data is fetched successfully, it displays:
        * City Name
        * Current Temperature (specify units, e.g., °C or °F)
        * Weather conditions (e.g., "clear sky", "light rain")
        * (Optionally) A weather icon.
5.  **Loading State Indication:**
    * Displays a "Loading..." message or spinner while data is being fetched.
6.  **Error Handling:**
    * If the API call fails or returns an error, an appropriate error message is displayed to the user.

### Usage Example

```jsx
// Inside a parent component (e.g., DashboardPage.jsx)
import WeatherWidget from './components/WeatherWidget/WeatherWidget'; // Adjust path as needed

function DashboardPage() {
  return (
    <div>
      <h2>My Dashboard</h2>
      <WeatherWidget defaultLocation="London" />
      {/* Or with no default, relying on the component's internal default or user input */}
      {/* <WeatherWidget /> */}
    </div>
  );
}

export default DashboardPage;