**Mapping** is the standard way in React to loop through a list of data and turn it into UI elements (like links, table rows, or cards).

Here is a quick breakdown using the code found in your `Header.tsx` and `Showcase.tsx`.

### 1\. The Concept

In JavaScript/React, you don't use `for` loops inside your HTML (JSX). Instead, you use `.map()`. **Formula:** `DataArray.map( item => <Component /> )`

* * *

### 2\. Real Example: The Header Navigation

In **`Header.tsx`**, you have a list of links (`mainNav`). You want to turn that list of *data* into a list of `<Link>` *components*.

**The Data (Input):**

TypeScript

```
// Defined in App.tsx (passed to Header as props)
const mainNav = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' }
];
```

**The Map (The Code):** *Found in `Header.tsx` lines 86-88*

TypeScript

```
<nav className={styles.desktopNav}>
  {/* Loop through every 'item' in the 'mainNav' array */}
  {mainNav.map(item => (
     // Call the helper function to render the actual link
     renderNavItem(item, false) 
  ))}
</nav>
```

**The Result (Output):** React renders this behind the scenes:

HTML

```
<nav>
  <a href="/">Home</a>
  <a href="/products">Products</a>
</nav>
```

* * *

### 3\. Real Example: The Table Rows

In **`Showcase.tsx`**, you pass an array of employees to the `Table` component. The `Table` component (internally) maps over this data to create rows.

**The Data:**

TypeScript

```
// From Showcase.tsx
const data = [
  { name: 'Wade Wilson', role: 'Mercenary' },
  { name: 'Peter Parker', role: 'Photographer' }
]
```

**How it works internally (Mental Model):**

TypeScript

```
<tbody>
  {data.map((employee, index) => (
    <tr key={index}>
      <td>{employee.name}</td>
      <td>{employee.role}</td>
    </tr>
  ))}
</tbody>
```

### ⚡ Critical Rule: The `key` Prop

Whenever you map, React needs a unique identifier (`key`) for each item to track updates efficiently.

- **Good:** `key={user.id}` (IDs from database)
    
- **Okay:** `key={item.label}` (If labels never repeat)
    
- **Bad:** `key={index}` (Avoid if list order changes)
    

**Seen in `Header.tsx`:**

TypeScript

```
// Using the label as the key
<div key={item.label} className={styles.mobileGroup}>
```