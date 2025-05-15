# Analog_Clock React Component

A customizable analog clock component built with React. It can display the current time for any specified IANA timezone, or default to the user's local timezone. The appearance of the clock hands is also customizable via props.

## Features

* Displays time with hour, minute, and second hands.
* Supports custom IANA timezones (e.g., "America/New_York", "Europe/London").
* Defaults to the user's detected local IANA timezone if no timezone is specified.
* Allows customization of clock hand dimensions (height and width).
* Displays an optional location name beneath the clock.
* Includes CSS for basic styling and clock face numbers.

## Files

* `Analog_Clock.jsx`: The React component code.
* `clock.css`: The CSS styles for the clock face, numbers, and hands.

## Props

The `Analog_Clock` component accepts the following props:

| Prop               | Type   | Optional | Default Value                                  | Description                                                                                                |
| :----------------- | :----- | :------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `timezone`         | string | Yes      | User's detected local IANA timezone, or system local | An IANA timezone string (e.g., "America/New_York", "UTC"). If omitted, attempts to use the user's local IANA timezone. |
| `location_Name`    | string | Yes      | `undefined` (nothing displayed)                | A name or label to display beneath the clock (e.g., "New York", "Local Time").                               |
| `hourHandHeight`   | number | Yes      | `50`                                           | Height of the hour hand in pixels.                                                                         |
| `hourHandWidth`    | number | Yes      | `6`                                            | Width of the hour hand in pixels.                                                                          |
| `minuteHandHeight` | number | Yes      | `75`                                           | Height of the minute hand in pixels.                                                                       |
| `minuteHandWidth`  | number | Yes      | `4`                                            | Width of the minute hand in pixels.                                                                        |
| `secondHandHeight` | number | Yes      | `80`                                           | Height of the second hand in pixels.                                                                       |
| `secondHandWidth`  | number | Yes      | `2`                                            | Width of the second hand in pixels.                                                                        |

## Usage Example

```jsx
import React from 'react';
import Analog_Clock from './Analog_Clock'; // Adjust path if necessary
import './clock.css'; // Make sure to import the CSS

function MyApp() {
  return (
    <div>
      <h1>My Clocks</h1>

      {/* Clock for New York with default hand sizes */}
      <Analog_Clock
        timezone="America/New_York"
        location_Name="New York"
      />

      {/* Clock for London with custom (shorter) hand sizes */}
      <Analog_Clock
        timezone="Europe/London"
        location_Name="London (Custom Hands)"
        hourHandHeight={40}
        hourHandWidth={5}
        minuteHandHeight={60}
        minuteHandWidth={3}
        secondHandHeight={65}
        secondHandWidth={1.5}
      />

      {/* Clock for user's local timezone */}
      <Analog_Clock location_Name="My Local Time" />
    </div>
  );
}

export default MyApp;