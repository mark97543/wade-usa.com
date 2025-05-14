## Component: UnitConverter.jsx

### Purpose

The `UnitConverter` component provides users with a tool to convert values between various units across different categories like temperature, length, and weight. It allows for dynamic selection of conversion types and their respective units, displaying the calculated result.

### Props

| Prop                    | Type              | Required | Default Value             | Description                                                                                                                                                              |
|-------------------------|-------------------|----------|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultConversionType` | String            | No       | `"length"` (example)      | The initial type of conversion (e.g., "temperature", "length", "weight") selected when the widget loads.                                                                 |
| `conversionConfig`      | Object (detailed) | No       | (Internal Default)        | An object defining the available conversion types, their units, and the logic (formulas or factors) for conversion. If not provided, the component uses an internal configuration. |

*(Note: If `conversionConfig` is a prop, its structure should be well-documented. If it's internal, this prop wouldn't exist, and the internal structure should be noted under "Conversion Logic Details".)*

### State

* `conversionType` (String): Stores the currently selected category of conversion (e.g., `"length"`, `"temperature"`).
* `availableTypes` (Array of Strings): Lists the available conversion categories (e.g., `["temperature", "length", "weight"]`).
* `inputValue` (String | Number): Holds the numerical value entered by the user for conversion.
* `fromUnit` (String): Stores the selected unit *from* which the user wants to convert.
* `toUnit` (String): Stores the selected unit *to* which the user wants to convert.
* `availableUnits` (Array of Strings): Lists the units available for the currently selected `conversionType` (e.g., for "length": `["meters", "feet", "inches"]`).
* `outputValue` (String | Number): Holds the calculated result of the conversion. Displayed to the user.

### Key Functionality & Logic

1.  **Type Selection:**
    * Allows the user to select a conversion type (e.g., from a dropdown menu: Temperature, Length, Weight).
    * When the conversion type changes, the available units for "From" and "To" fields are dynamically updated.
2.  **Unit Selection:**
    * Provides dropdown menus for the user to select the "From Unit" and "To Unit" from the `availableUnits` for the chosen `conversionType`.
3.  **Value Input:**
    * An input field allows the user to enter the numerical value they wish to convert.
4.  **Real-time Conversion:**
    * The conversion is typically calculated and the `outputValue` is updated whenever `inputValue`, `fromUnit`, `toUnit`, or `conversionType` changes.
5.  **Display Result:**
    * The `outputValue` (the converted result) is displayed, often formatted to a reasonable number of decimal places.

### Conversion Logic Details

The core conversion logic is handled internally based on predefined rules for each unit type. This can be structured in a configuration object (either internal to the component or passed via the `conversionConfig` prop).

* **Temperature Conversions:** Typically use specific formulas (e.g., Celsius to Fahrenheit: $(C \times 9/5) + 32$).
* **Length/Weight/Other Factor-Based Conversions:** Often use a base unit for each category (e.g., 'meter' for length). All units within that category have a conversion factor relative to this base unit.
    * To convert from Unit A to Unit B:
        1.  Convert value from Unit A to the base unit (Value / Factor_A).
        2.  Convert the base unit value to Unit B (BaseValue * Factor_B).

**Example Internal Configuration Structure (Illustrative):**

```javascript
const INTERNAL_CONVERSION_CONFIG = {
  temperature: {
    displayName: "Temperature",
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    formulas: { // Direct conversion formulas
      'Celsius': {
        'Fahrenheit': (c) => (c * 9/5) + 32,
        'Kelvin': (c) => c + 273.15,
      },
      'Fahrenheit': { /* ... */ },
      'Kelvin': { /* ... */ }
    }
  },
  length: {
    displayName: "Length",
    units: ['Meters', 'Feet', 'Inches', 'Kilometers', 'Miles'],
    baseUnit: 'Meters',
    factors: { // Relative to baseUnit ('Meters')
      'Meters': 1,
      'Feet': 0.3048,
      'Inches': 0.0254,
      'Kilometers': 1000,
      'Miles': 1609.34
    }
  },
  weight: {
    displayName: "Weight",
    units: ['Kilograms', 'Pounds', 'Ounces', 'Grams'],
    baseUnit: 'Kilograms',
    factors: { // Relative to baseUnit ('Kilograms')
      'Kilograms': 1,
      'Pounds': 0.453592,
      'Ounces': 0.0283495,
      'Grams': 0.001
    }
  }
};

Usage Example
JavaScript

// Inside a parent component (e.g., DashboardPage.jsx)
import UnitConverter from './components/UnitConverter/UnitConverter'; // Adjust path as needed

function DashboardPage() {
  return (
    <div>
      <h2>Utilities</h2>
      <UnitConverter defaultConversionType="temperature" />
      {/* Or to use a custom configuration if the prop is supported: */}
      {/* <UnitConverter conversionConfig={myCustomConfig} /> */}
    </div>
  );
}

export default DashboardPage;




