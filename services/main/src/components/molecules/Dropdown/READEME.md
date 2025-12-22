# Dropdown Component

A lightweight, accessible React dropdown menu with auto-close functionality when clicking outside.

## Features

- **Flexible Trigger:** Accepts text, icons, or any React node as the toggle button.
- **Click-Outside Detection:** Automatically closes when the user clicks anywhere else.
- **TypeScript Support:** Fully typed props.
- **CSS Modules:** Scoped styling to prevent conflicts.

## Usage

```
import { Dropdown, DropdownItem } from './Dropdown';

const MyComponent = () => {
  return (
    <Dropdown trigger={<button>Open Menu</button>}>
      
      <DropdownItem onClick={() => console.log('Edit')}>
        Edit Profile
      </DropdownItem>
      
      <DropdownItem onClick={() => console.log('Logout')}>
        Logout
      </DropdownItem>

    </Dropdown>
  );
};
```

## API Reference

### `<Dropdown />`

| Prop       | Type        | Description                                                  |
| ---------- | ----------- | ------------------------------------------------------------ |
| `trigger`  | `ReactNode` | The element displayed that toggles the menu (e.g., a button or icon). |
| `children` | `ReactNode` | The content of the dropdown menu (usually `<DropdownItem />`s). |

### `<DropdownItem />`

| Prop       | Type             | Description                                               |
| ---------- | ---------------- | --------------------------------------------------------- |
| `children` | `ReactNode`      | The text or content inside the item.                      |
| `onClick`  | `() => void`     | Function called when the item is clicked.                 |
| `...props` | `HTMLAttributes` | Accepts standard button attributes (className, id, etc.). |

## Styling

This component relies on `Dropdown.module.css`. Ensure the following classes are defined:

- `.container`: Wrapper relative positioning.
- `.trigger`: The button that opens the menu.
- `.menu`: The absolute positioned list (default `display: none`).
- `.open`: The class added when open (set `display: block`).
- `.item`: Styling for individual list items.