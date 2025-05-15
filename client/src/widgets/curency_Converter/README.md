# React Component: CurrencyConverter.jsx

**Last Updated:** May 13, 2025

## 1. Overview and Purpose

The `CurrencyConverter.jsx` component is a user interface element designed for the Wade-USA.com project. Its primary purpose is to allow users to:

* Input a numerical amount.
* Select a currency to convert *from*.
* Select a currency to convert *to*.
* View the calculated converted amount based on current or cached exchange rates.

This component is built using React and aims for clarity and reusability. As a learning project, it contains (or should contain) detailed inline comments explaining the code's functionality step-by-step.

## 2. File Location

This component is typically located at:
`[your-project-root]/src/components/widgets/currency-converter/CurrencyConverter.jsx`
*(Please adjust the path if it's different in your project structure)*

## 3. Props (Properties)

Props are inputs to a React component. Below are the potential props this component might accept. If your component doesn't accept props, this section can state that.

* **`defaultAmount`** (Number, Optional)
    * Description: The initial amount to be displayed in the input field when the converter loads.
    * Example: `100`
    * Default: `1` (or as implemented)

* **`defaultFromCurrency`** (String, Optional)
    * Description: The default currency code (e.g., 'USD') for the "convert from" selection.
    * Example: `"USD"`
    * Default: `"USD"` (or as implemented)

* **`defaultToCurrency`** (String, Optional)
    * Description: The default currency code (e.g., 'EUR') for the "convert to" selection.
    * Example: `"EUR"`
    * Default: `"EUR"` (or as implemented)

* **`availableCurrencies`** (Array of Objects, Optional)
    * Description: A list of currency objects that the user can select from. If not provided, the component might fetch this list itself or use a hardcoded list.
    * Format: `[{ code: 'USD', name: 'US Dollar' }, { code: 'EUR', name: 'Euro' }, ...]`
    * Default: An empty array `[]` or a predefined list.

*(Adjust this section based on the actual props your `CurrencyConverter.jsx` component accepts.)*

## 4. State Variables

State variables are used to manage data that can change over time within the component, causing it to re-render.

* **`amount`** (Number | String)
    * Description: Stores the current value entered by the user in the "amount" input field.
    * Initial Value: `props.defaultAmount` or `1`.
    * Managed by: `useState` hook.
    * Setter function: `setAmount`

* **`fromCurrency`** (String)
    * Description: Stores the currency code selected by the user to convert from.
    * Initial Value: `props.defaultFromCurrency` or a default like `"USD"`.
    * Managed by: `useState` hook.
    * Setter function: `setFromCurrency`

* **`toCurrency`** (String)
    * Description: Stores the currency code selected by the user to convert to.
    * Initial Value: `props.defaultToCurrency` or a default like `"EUR"`.
    * Managed by: `useState` hook.
    * Setter function: `setToCurrency`

* **`exchangeRate`** (Number | null)
    * Description: Stores the fetched exchange rate between `fromCurrency` and `toCurrency`. It's `null` if no rate is fetched or an error occurs.
    * Initial Value: `null`.
    * Managed by: `useState` hook.
    * Setter function: `setExchangeRate`

* **`convertedAmount`** (Number | String | null)
    * Description: Stores the calculated converted amount. Can be a string to display messages like "Calculating..." or an error.
    * Initial Value: `null` or `""`.
    * Managed by: `useState` hook.
    * Setter function: `setConvertedAmount`

* **`currenciesList`** (Array of Objects)
    * Description: Stores the list of available currencies for the dropdowns (e.g., `[{ code: 'USD', name: 'US Dollar' }, ...]`). This might be populated from props or an API call.
    * Initial Value: `props.availableCurrencies` or `[]`.
    * Managed by: `useState` hook.
    * Setter function: `setCurrenciesList`

* **`isLoading`** (Boolean)
    * Description: A flag to indicate if an asynchronous operation (like fetching exchange rates) is currently in progress. Used to show loading indicators in the UI.
    * Initial Value: `false`.
    * Managed by: `useState` hook.
    * Setter function: `setIsLoading`

* **`error`** (String | null)
    * Description: Stores any error message that occurs during API calls or calculations. If `null`, no error is displayed.
    * Initial Value: `null`.
    * Managed by: `useState` hook.
    * Setter function: `setError`

*(Adjust these state variables to match your actual implementation.)*

## 5. Key Functionality and Logic

### a. Initialization (`useEffect` hook for setup)
* **Purpose**: To perform initial setup when the component mounts.
* **Actions**:
    * If `availableCurrencies` prop is not provided or is empty, it might trigger a function to fetch a list of supported currencies from an API or a static file.
    * Populates the `currenciesList` state.
* **Dependencies**: Typically an empty array `[]` to run only once on mount.

### b. Fetching Exchange Rates (`useEffect` hook for currency/amount changes)
* **Purpose**: To fetch the relevant exchange rate whenever the `amount`, `fromCurrency`, or `toCurrency` changes.
* **Trigger**: This effect runs when `amount`, `fromCurrency`, or `toCurrency` state variables are updated.
* **Actions**:
    1.  Validates that `fromCurrency` and `toCurrency` are selected and different, and that `amount` is a positive number.
    2.  Sets `isLoading` to `true` and clears any previous `error`.
    3.  Makes an API call (e.g., using `Workspace` or a library like `axios`) to an exchange rate provider.
        * The API endpoint will likely require `fromCurrency` and `toCurrency` as parameters.
        * *Example API Interaction Module*: `src/services/exchangeRateAPI.js` (This is a hypothetical location for your API logic).
    4.  **On successful API response**:
        * Parses the response to extract the exchange rate.
        * Updates the `exchangeRate` state.
        * Calculates `convertedAmount` (`amount * exchangeRate`).
        * Formats the `convertedAmount` (e.g., to 2-4 decimal places).
        * Sets `isLoading` to `false`.
    5.  **On API error or failure**:
        * Sets an appropriate message in the `error` state.
        * Sets `convertedAmount` to an empty string or an error indicator.
        * Sets `isLoading` to `false`.
* **Dependencies**: `[amount, fromCurrency, toCurrency]`.

### c. Event Handlers
These functions are called in response to user interactions.

* **`handleAmountChange(event)`**:
    * Triggered when the user types in the amount input field.
    * Updates the `amount` state with the new value.
    * May include input validation (e.g., allow only numbers).

* **`handleFromCurrencyChange(event)`**:
    * Triggered when the user selects a currency from the "convert from" dropdown.
    * Updates the `fromCurrency` state with the selected currency code.

* **`handleToCurrencyChange(event)`**:
    * Triggered when the user selects a currency from the "convert to" dropdown.
    * Updates the `toCurrency` state with the selected currency code.

* **`handleSwapCurrencies()`**:
    * Triggered when the user clicks a "swap" button (if implemented).
    * Swaps the values of `fromCurrency` and `toCurrency` states. This will, in turn, trigger the `useEffect` hook to fetch new rates and recalculate.

## 6. JSX Structure (Rendered Output)

The `render` method (or the return statement in a functional component) defines the HTML structure. It typically includes:

* A container `div` for the entire widget.
* A label and an `input` field of `type="number"` for the `amount`.
    * `value` bound to the `amount` state.
    * `onChange` connected to `handleAmountChange`.
* A `select` dropdown for `fromCurrency`.
    * `value` bound to the `fromCurrency` state.
    * `onChange` connected to `handleFromCurrencyChange`.
    * `<option>` elements are dynamically generated from `currenciesList` state.
* (Optional) A "swap currencies" button, calling `handleSwapCurrencies` on click.
* A `select` dropdown for `toCurrency`.
    * `value` bound to the `toCurrency` state.
    * `onChange` connected to `handleToCurrencyChange`.
    * `<option>` elements are dynamically generated from `currenciesList` state.
* A display area for the `convertedAmount`. This could be a read-only input field or a paragraph (`<p>`) tag.
    * Shows "Calculating..." or a spinner when `isLoading` is `true`.
* An area to display error messages if the `error` state is not `null`.

*(This is a general structure. Your actual JSX will have specific class names, layouts, and potentially sub-components.)*

## 7. How to Use (Example Integration)

To use the `CurrencyConverter` component in another part of your application (e.g., a dashboard page):

```jsx
// Example in DashboardPage.jsx
import React from 'react';
import CurrencyConverter from './widgets/currency-converter/CurrencyConverter'; // Adjust path

function DashboardPage() {
  return (
    <div>
      <h2>My Dashboard</h2>
      {/* Other content */}
      <section>
        <h3>Currency Converter</h3>
        <CurrencyConverter
          defaultAmount={50}
          defaultFromCurrency="GBP"
          defaultToCurrency="JPY"
        />
      </section>
      {/* Other content */}
    </div>
  );
}

export default DashboardPage;