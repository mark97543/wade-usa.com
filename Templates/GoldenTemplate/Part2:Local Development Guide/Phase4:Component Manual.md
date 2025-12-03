This comprehensive guide provides detailed documentation for every component in the `wade-usa.com` React Design System, following the Atomic Design methodology.

All components are **theme-aware**, automatically inheriting colors, fonts, and styling from the **Directus `Global_Theme` collection** via the `ThemeProvider`.

------



## 1. Core Architecture & Theming





### 1.1 Imports and Paths



All components are designed to be imported using the root path alias `@/`:

TypeScript

```
import { ComponentName } from '@/components/category/ComponentName/ComponentName';
```



### 1.2 Theme Variable Reference



Styling (colors, backgrounds, borders) is governed by CSS variables defined in `:root` and injected by Directus:

| **CSS Variable**  | **Role**                                                     | **Example Usage**                       |
| ----------------- | ------------------------------------------------------------ | --------------------------------------- |
| `--accent-color`  | Primary brand color.                                         | Buttons, Progress Bar fill, Active Tabs |
| `--primary-color` | Main text color (usually dark text on light backgrounds or vice-versa). | Body Text, Input Text                   |
| `--surface-color` | Background for contained elements (Cards, Modals).           | Card backgrounds                        |
| `--danger-color`  | Error/Destructive state color.                               | Danger Buttons, Alert Borders           |

------



## 2. Atoms (Foundation)



Atoms are the basic building blocks, encapsulating single input elements or visual indicators.



### 2.1. Button (`/atoms/Button`)



A primary interactive element with support for variants and loading states.

| **Prop**    | **Type**                           | **Default** | **Description**                                            |
| ----------- | ---------------------------------- | ----------- | ---------------------------------------------------------- |
| `variant`   | `'primary' | 'outline' | 'danger'` | `'primary'` | Visual style/color.                                        |
| `size`      | `'sm' | 'md' | 'lg'`               | `'md'`      | Padding and font size.                                     |
| `isLoading` | `boolean`                          | `false`     | Shows an integrated `<Spinner />` and disables the button. |
| `children`  | `ReactNode`                        | -           | The button text/content.                                   |

**Simple Example:**

TypeScript

```
import { Button } from '@/components/atoms/Button/Button';

// Primary Button (uses --accent-color)
<Button onClick={saveData}>Save Changes</Button>

// Destructive Action
<Button variant="danger" size="sm">Delete Account</Button>

// Disabled/Loading State
<Button isLoading={isSubmitting}>Submitting...</Button>
```



### 2.2. Input (`/atoms/Input`)



A standard text field supporting error feedback.

| **Prop**   | **Type**              | **Description**                                              |
| ---------- | --------------------- | ------------------------------------------------------------ |
| `label`    | `string`              | Optional label text shown above the input.                   |
| `error`    | `string`              | Displays error text and applies `--danger-color` border styling. |
| `...props` | `InputHTMLAttributes` | Accepts `type`, `placeholder`, `value`, etc..                |

**Simple Example:**

TypeScript

```
import { Input } from '@/components/atoms/Input/Input';

const [email, setEmail] = useState('');
const [error, setError] = useState('');

<Input 
  placeholder="you@wade-usa.com" 
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
/>
```



### 2.3. Spinner (`/atoms/Spinner`)



A simple, pure CSS loading indicator.

| **Prop** | **Type**             | **Default** | **Description**                          |
| -------- | -------------------- | ----------- | ---------------------------------------- |
| `size`   | `'sm' | 'md' | 'lg'` | `'md'`      | Controls the size of the spinner circle. |

**Simple Example:**

TypeScript

```
import { Spinner } from '@/components/atoms/Spinner/Spinner';

<div style={{ color: 'var(--accent-color)' }}>
  <Spinner size="lg" />
  <span>Loading Page...</span>
</div>
```



### 2.4. Switch (`/atoms/Switch`)



An accessible binary toggle using a hidden checkbox with `role="switch"`.

| **Prop**   | **Type**          | **Description**                  |
| ---------- | ----------------- | -------------------------------- |
| `label`    | `string`          | Descriptive text for the toggle. |
| `checked`  | `boolean`         | The current state.               |
| `onChange` | `(event) => void` | Event handler to update state.   |

**Simple Example:**

TypeScript

```
import { Switch } from '@/components/atoms/Switch/Switch';

const [enabled, setEnabled] = useState(false);

<Switch 
  id="toggle-id"
  label="Receive Email Alerts"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```



### 2.5. Range (`/atoms/Range`)



A controlled input slider that displays its current value.

| **Prop**   | **Type**                  | **Description**                         |
| ---------- | ------------------------- | --------------------------------------- |
| `label`    | `string`                  | Text to display above the slider track. |
| `min`      | `number`                  | Minimum range value.                    |
| `max`      | `number`                  | Maximum range value.                    |
| `step`     | `number`                  | Increment value for the slider.         |
| `onChange` | `(value: number) => void` | Handler for new numerical value.        |

**Simple Example:**

TypeScript

```
import { Range } from '@/components/atoms/Range/Range';

const [zoom, setZoom] = useState(1.0);

<Range
  id="zoom-slider"
  label={`Image Zoom: ${zoom}x`}
  min={0.5}
  max={3.0}
  step={0.1}
  initialValue={zoom}
  onChange={setZoom}
/>
```



### 2.6. ProgressBar (`/atoms/ProgressBar`)



Displays task progress or status with thematic coloring.

| **Prop**  | **Type**                           | **Default** | **Description**                     |
| --------- | ---------------------------------- | ----------- | ----------------------------------- |
| `value`   | `number`                           | -           | Current value (0 to 100).           |
| `label`   | `string`                           | -           | Text label displayed above the bar. |
| `variant` | `'primary' | 'danger' | 'success'` | `'primary'` | Color of the progress bar fill.     |

**Simple Example:**

TypeScript

```
import { ProgressBar } from '@/components/atoms/ProgressBar/ProgressBar';

<ProgressBar 
  value={45} 
  label="Uploading Assets"
/>

<ProgressBar 
  value={90} 
  label="Storage Capacity"
  variant="danger"
/>
```

------



## 3. Molecules (Compound Components)



Molecules combine Atoms and complex state logic for specific UI patterns.



### 3.1. FormGroup (`/molecules/FormGroup`)



A layout wrapper to standardize spacing for a form field (label, input, and error).

| **Prop**   | **Type**          | **Description**                           |
| ---------- | ----------------- | ----------------------------------------- |
| `label`    | `string`          | The field label.                          |
| `id`       | `string`          | HTML ID to link label to the child input. |
| `error`    | `string`          | Error message text.                       |
| `children` | `React.ReactNode` | The `<Input />` or other form element.    |

**Simple Example:**

TypeScript

```
import { FormGroup } from '@/components/molecules/FormGroup/FormGroup';
import { Input } from '@/components/atoms/Input/Input';

<FormGroup label="Username" id="username" error={validationErrors.username}>
  <Input id="username" onChange={handleInput} />
</FormGroup>
```



### 3.2. Card (`/molecules/Card`)



A contained surface for grouping content, typically used for forms or sections.

| **Prop**   | **Type**          | **Description**                                       |
| ---------- | ----------------- | ----------------------------------------------------- |
| `title`    | `string`          | Optional header text centered at the top of the card. |
| `children` | `React.ReactNode` | Content inside the card.                              |

**Simple Example:**

TypeScript

```
import { Card } from '@/components/molecules/Card/Card';

<Card title="Portal Login">
  <p>Please enter your credentials below.</p>
  {/* ... FormGroups go here ... */}
</Card>
```



### 3.3. Alert (`/molecules/Alert`)



A simple banner for displaying immediate feedback.

| **Prop**  | **Type**              | **Default** | **Description**                |
| --------- | --------------------- | ----------- | ------------------------------ |
| `message` | `string`              | -           | The text content of the alert. |
| `type`    | `'success' | 'error'` | `'error'`   | Controls coloring (Green/Red). |

**Simple Example:**

TypeScript

```
import { Alert } from '@/components/molecules/Alert/Alert';

{apiError && (
  <Alert type="error" message={apiError} />
)}
```



### 3.4. Dropdown (`/molecules/Dropdown`)



A reusable popover menu that closes automatically when clicking outside.

| **Component**    | **Prop**  | **Type**          | **Description**                                          |
| ---------------- | --------- | ----------------- | -------------------------------------------------------- |
| **Dropdown**     | `trigger` | `React.ReactNode` | The element clicked to open the menu (e.g., `<Button>`). |
| **DropdownItem** | `onClick` | `() => void`      | Function executed on item click.                         |

**Simple Example:**

TypeScript

```
import { Dropdown, DropdownItem } from '@/components/molecules/Dropdown/Dropdown';

<Dropdown trigger={<Button size="sm">Actions</Button>}>
  <DropdownItem onClick={() => navigate('/profile')}>My Profile</DropdownItem>
  <DropdownItem onClick={logout}>Log Out</DropdownItem>
</Dropdown>
```



### 3.5. Table (`/molecules/Table`)



A theme-aware data grid with striped rows and support for click actions.

| **Prop**     | **Type**                            | **Description**                                    |
| ------------ | ----------------------------------- | -------------------------------------------------- |
| `columns`    | `{ key: string, header: string }[]` | Defines the columns and which data key to display. |
| `data`       | `any[]`                             | Array of objects to populate the table rows.       |
| `onRowClick` | `(item: any) => void`               | Optional handler for row clicks.                   |

**Simple Example:**

TypeScript

```
import { Table } from '@/components/molecules/Table/Table';

const userColumns = [{ key: 'id', header: 'ID' }, { key: 'name', header: 'User Name' }];
const userData = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

<Table columns={userColumns} data={userData} onRowClick={(row) => alert(row.name)}/>
```



### 3.6. RadioGroup (`/molecules/RadioGroup`)



Manages the state for a group of mutually exclusive radio buttons.

| **Prop**       | **Type**                             | **Description**                                 |
| -------------- | ------------------------------------ | ----------------------------------------------- |
| `name`         | `string`                             | Unique HTML name attribute for the group.       |
| `legend`       | `string`                             | Accessibility label for the group (`<legend>`). |
| `options`      | `{ label: string, value: string }[]` | The options available for selection.            |
| `defaultValue` | `string`                             | The value that is selected on initial render.   |
| `onChange`     | `(value: string) => void`            | Returns the single selected value.              |

**Simple Example:**

TypeScript

```
import { RadioGroup } from '@/components/molecules/RadioGroup/RadioGroup';

<RadioGroup
  name="color_scheme"
  legend="Select Theme"
  options={[
    { label: 'Dark', value: 'dark' },
    { label: 'Light', value: 'light' },
  ]}
  defaultValue="dark"
  onChange={setScheme}
/>
```



### 3.7. CheckboxGroup (`/molecules/CheckboxGroup`)



Manages the state for a group of independent, multi-selectable checkboxes.

| **Prop**        | **Type**                             | **Description**                              |
| --------------- | ------------------------------------ | -------------------------------------------- |
| `name`          | `string`                             | Unique HTML name attribute for the group.    |
| `legend`        | `string`                             | Accessibility label for the group.           |
| `options`       | `{ label: string, value: string }[]` | The options available for selection.         |
| `initialValues` | `string[]`                           | Array of values selected on initial render.  |
| `onChange`      | `(values: string[]) => void`         | Returns the entire array of selected values. |

**Simple Example:**

TypeScript

```
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup/CheckboxGroup';

<CheckboxGroup
  name="permissions"
  legend="User Roles"
  options={[
    { label: 'View Reports', value: 'view' },
    { label: 'Edit Data', value: 'edit' },
  ]}
  initialValues={['view']}
  onChange={updatePermissions}
/>
```



### 3.8. Tabs (`/molecules/Tabs`)



A navigation pattern for organizing content into labeled panels.

| **Prop**        | **Type**                                                     | **Description**                                              |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `tabs`          | `{ label: string, key: string, content: React.ReactNode }[]` | Array defining the button labels, unique keys, and panel content. |
| `initialTabKey` | `string`                                                     | The key of the tab to open by default.                       |

**Simple Example:**

TypeScript

```
import { Tabs } from '@/components/molecules/Tabs/Tabs';

const tabContent = [
    { label: 'General', key: 'general', content: <GeneralSettings /> },
    { label: 'API Keys', key: 'api', content: <ApiKeysTable /> },
];

<Tabs tabs={tabContent} initialTabKey="api" />
```



### 3.9. Pagination (`/molecules/Pagination`)



A control for navigating through large, paginated data sets.

| **Prop**       | **Type**                 | **Description**                                              |
| -------------- | ------------------------ | ------------------------------------------------------------ |
| `currentPage`  | `number`                 | The currently active page (1-indexed).                       |
| `totalPages`   | `number`                 | Total number of pages available.                             |
| `onPageChange` | `(page: number) => void` | Handler called when a button is clicked.                     |
| `pageRange`    | `number`                 | Number of page numbers to show around the current page (e.g., `2` for `[..., 4, 5, 6, 7, 8, ...]`). |

**Simple Example:**

TypeScript

```
import { Pagination } from '@/components/molecules/Pagination/Pagination';

const [page, setPage] = useState(1);

<Pagination 
  currentPage={page}
  totalPages={25}
  onPageChange={setPage}
  pageRange={1} // Shows [1, 2, 3, 4, ..., 25] if on page 3
/>
```



### 3.10. Accordion (`/molecules/Accordion`)



A single collapsible panel for content visibility control.

| **Prop**        | **Type**          | **Default** | **Description**                       |
| --------------- | ----------------- | ----------- | ------------------------------------- |
| `title`         | `string`          | -           | The text displayed on the header bar. |
| `children`      | `React.ReactNode` | -           | The content that expands/collapses.   |
| `isOpenDefault` | `boolean`         | `false`     | Sets the initial open state.          |

**Simple Example:**

TypeScript

```
import { Accordion } from '@/components/molecules/Accordion/Accordion';

<Accordion title="Read License Agreement" isOpenDefault={false}>
  <p>This software is provided AS-IS...</p>
</Accordion>
```



### 3.11. Modal (`/molecules/Modal`)



A dialog component that locks user focus, closes on Escape, and prevents background scrolling.

| **Prop**   | **Type**          | **Description**                        |
| ---------- | ----------------- | -------------------------------------- |
| `isOpen`   | `boolean`         | Controls visibility.                   |
| `onClose`  | `() => void`      | Function to close the modal.           |
| `title`    | `string`          | Text displayed in the modal header.    |
| `children` | `React.ReactNode` | The primary content of the modal body. |

**Simple Example:**

TypeScript

```
import { Modal } from '@/components/molecules/Modal/Modal';

const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Delete Item</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Deletion"
>
  <p>Are you sure you want to delete this item permanently?</p>
  <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
</Modal>
```

------



## 4. System Utility





### Toast Notification System



A global, non-intrusive notification system accessible via a custom hook. Messages stack in the bottom-right corner and auto-dismiss after 3 seconds by default.

| **Component**     | **Role**                                                     |
| ----------------- | ------------------------------------------------------------ |
| **ToastProvider** | Must wrap the entire application in `main.tsx` to establish the context. |
| **useToast**      | The hook used by any component to trigger a toast message.   |

| **Method/Parameter**                    | **Type**                                   | **Default** | **Description**                                 |
| --------------------------------------- | ------------------------------------------ | ----------- | ----------------------------------------------- |
| `showToast(message, variant, duration)` | `function`                                 | -           | The primary function to display a notification. |
| `message`                               | `string`                                   | -           | The text content.                               |
| `variant`                               | `'success' | 'error' | 'info' | 'warning'` | `'info'`    | Controls the toast's background color.          |
| `duration`                              | `number`                                   | `3000`      | Time in milliseconds to display the toast.      |

**Simple Example:**

TypeScript

```
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/atoms/Button/Button';

// 1. Inside your functional component:
const { showToast } = useToast();

// 2. Trigger the toast on an action:
<Button 
  onClick={() => {
    // API Call Failed, show error toast
    showToast("Login attempt failed. Please try again.", 'error', 5000);
  }}
  variant="danger"
>
  Login Failed
</Button>

<Button 
  onClick={() => {
    // Success confirmation
    showToast("User session refreshed.", 'success', 2000);
  }}
>
  Refresh
</Button>
```