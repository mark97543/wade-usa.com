# Wade-USA Component Library User Manual

**Version:** 1.0 **Tech Stack:** React, TypeScript, CSS Modules **Theme Engine:** Powered by Directus `Global_Theme` collection.

## 1. Atoms (Basic Elements)

These components are the smallest building blocks of the interface.

### Button

Primary interactive element. Supports loading states and variants.

**Import:**

```
import { Button } from '@/components/atoms/Button/Button';
```

**Props:**

| Prop        | Type                               | Default     | Description                          |
| ----------- | ---------------------------------- | ----------- | ------------------------------------ |
| `variant`   | `'primary' | 'outline' | 'danger'` | `'primary'` | Visual style of the button.          |
| `size`      | `'sm' | 'md'`                      | `'md'`      | Button size.                         |
| `isLoading` | `boolean`                          | `false`     | Shows a spinner and disables clicks. |
| `disabled`  | `boolean`                          | `false`     | Disables interaction.                |
| `children`  | `ReactNode`                        | -           | Text or icons inside the button.     |

**Usage:**

```
// 1. Standard Primary Button
<Button onClick={() => console.log('Clicked')}>
  Save Changes
</Button>

// 2. Outline Button (Secondary Action)
<Button variant="outline">
  Cancel
</Button>

// 3. Loading State (Automatic Spinner)
<Button isLoading={true}>
  Processing...
</Button>
```

### Input

Standard text field for forms.

**Import:**

```
import { Input } from '@/components/atoms/Input/Input';
```

**Props:**

| Prop       | Type                  | Description                                                  |
| ---------- | --------------------- | ------------------------------------------------------------ |
| `label`    | `string`              | Optional label text shown above input.                       |
| `error`    | `string`              | Error message shown below input (turns border red).          |
| `...props` | `InputHTMLAttributes` | Accepts all standard HTML input props (type, placeholder, value, etc.). |

**Usage:**

```
// 1. Basic Input
<Input placeholder="Enter your name" />

// 2. Input with Label
<Input 
  label="Email Address" 
  type="email" 
  placeholder="you@example.com" 
/>

// 3. Input with Error
<Input 
  label="Password" 
  type="password" 
  value="wrong_password"
  error="Incorrect password, please try again." 
/>
```

### Spinner

Pure CSS loading indicator.

**Import:**

```
import { Spinner } from '@/components/atoms/Spinner/Spinner';
```

**Props:**

| Prop   | Type                 | Default | Description                 |
| ------ | -------------------- | ------- | --------------------------- |
| `size` | `'sm' | 'md' | 'lg'` | `'md'`  | Size of the spinner circle. |

**Usage:**

```
// 1. Default Spinner
<Spinner />

// 2. Large Spinner (for page loading)
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <Spinner size="lg" />
</div>
```

### Hamburger

Animated menu toggle button (Lines -> X). Used primarily in the Header.

**Import:**

```
import { Hamburger } from '@/components/atoms/Hamburger/Hamburger';
```

**Props:**

| Prop     | Type         | Description                            |
| -------- | ------------ | -------------------------------------- |
| `isOpen` | `boolean`    | `true` shows X, `false` shows 3 lines. |
| `toggle` | `() => void` | Function to call when clicked.         |

**Usage:**

```
const [isOpen, setIsOpen] = useState(false);

return (
  <Hamburger 
    isOpen={isOpen} 
    toggle={() => setIsOpen(!isOpen)} 
  />
);
```

## 2. Molecules (Compound Components)

These components combine atoms or logic to form usable UI patterns.

### Card

A contained surface for grouping content.

**Import:**

```
import { Card } from '@/components/molecules/Card/Card';
```

**Props:**

| Prop       | Type        | Description                                  |
| ---------- | ----------- | -------------------------------------------- |
| `title`    | `string`    | Optional header text at the top of the card. |
| `children` | `ReactNode` | Content inside the card.                     |

**Usage:**

```
// 1. Simple Card
<Card>
  <p>This is some content inside a card box.</p>
</Card>

// 2. Card with Title
<Card title="User Settings">
  <form>
    {/* Form inputs go here */}
    <Button>Save</Button>
  </form>
</Card>
```

### FormGroup

Layout wrapper for forms to ensure consistent spacing.

**Import:**

```
import { FormGroup } from '@/components/molecules/FormGroup/FormGroup';
```

**Props:**

| Prop       | Type        | Description                                     |
| ---------- | ----------- | ----------------------------------------------- |
| `label`    | `string`    | Text label for the field.                       |
| `id`       | `string`    | HTML ID to link label to input (accessibility). |
| `error`    | `string`    | Error message text.                             |
| `children` | `ReactNode` | The Input component.                            |

**Usage:**

```
<FormGroup label="Username" id="username" error={errors.username}>
  <Input id="username" value={username} onChange={handleChange} />
</FormGroup>
```

### Alert

Feedback banner for success or error states.

**Import:**

```
import { Alert } from '@/components/molecules/Alert/Alert';
```

**Props:**

| Prop      | Type                  | Default              | Description                             |
| --------- | --------------------- | -------------------- | --------------------------------------- |
| `type`    | `'success' | 'error'` | `'error'`            | Colors: Green (Success) or Red (Error). |
| `message` | `string`              | The text to display. |                                         |

**Usage:**

```
// 1. Success Message
<Alert type="success" message="Profile updated successfully!" />

// 2. Error Message
<Alert type="error" message="Failed to connect to server." />
```

### Dropdown

A popover menu triggered by a click. Closes when clicking outside.

**Import:**

```
import { Dropdown, DropdownItem } from '@/components/molecules/Dropdown/Dropdown';
```

**Props (Dropdown):**

| Prop       | Type        | Description                                           |
| ---------- | ----------- | ----------------------------------------------------- |
| `trigger`  | `ReactNode` | The element (Button/Text) you click to open the menu. |
| `children` | `ReactNode` | A list of `DropdownItem` components.                  |

**Props (DropdownItem):**

| Prop       | Type         | Description                   |
| ---------- | ------------ | ----------------------------- |
| `onClick`  | `() => void` | Function to run when clicked. |
| `children` | `ReactNode`  | Item text.                    |

**Usage:**

```
<Dropdown trigger={<Button>Options ▼</Button>}>
  <DropdownItem onClick={() => console.log('Edit')}>Edit</DropdownItem>
  <DropdownItem onClick={() => console.log('Delete')}>Delete</DropdownItem>
</Dropdown>
```

### Table

Responsive data grid with striped rows.

**Import:**

```
import { Table } from '@/components/molecules/Table/Table';
```

**Props:**

| Prop         | Type                                | Description                                                  |
| ------------ | ----------------------------------- | ------------------------------------------------------------ |
| `columns`    | `{ key: string, header: string }[]` | **Configuration Array.**• `key`: Property name in data object.• `header`: Text for the column header. |
| `data`       | `any[]`                             | **Data Source.** Array of objects. Keys must match the `key` defined in `columns`. |
| `onRowClick` | `(item) => void`                    | **Action Handler.** Optional function triggered when a user clicks a row. |

**Usage:**

```
// 1. Define Columns
const columns = [
  { key: 'name', header: 'Employee Name' },
  { key: 'role', header: 'Job Title' }
];

// 2. Define Data
const data = [
  { name: 'Wade Wilson', role: 'Mercenary' },
  { name: 'Peter Parker', role: 'Photographer' }
];

// 3. Render Table
<Table 
  columns={columns} 
  data={data} 
  onRowClick={(row) => alert(`Clicked ${row.name}`)} 
/>
```

## 3. Organisms & Templates

High-level structures used to frame pages.

### Header

The main navigation bar. Automatically handles authentication state and mobile responsiveness.

**Import:**

```
import { Header } from '@/components/organisms/Header/Header';
```

**Usage:**

```
// Inside any page or layout wrapper
return (
  <>
    <Header />
    <main style={{ paddingTop: '2rem' }}>
      <h1>Page Content</h1>
    </main>
  </>
);
```

### AuthLayout

A centered layout wrapper designed specifically for Login and Registration pages.

**Import:**

```
import { AuthLayout } from '@/components/templates/AuthLayout/AuthLayout';
```

**Usage:**

```
return (
  <AuthLayout>
    <Card title="Welcome Back">
       <form>
         <Input label="Email" />
         <Input label="Password" type="password" />
         <Button>Login</Button>
       </form>
    </Card>
  </AuthLayout>
);
```
