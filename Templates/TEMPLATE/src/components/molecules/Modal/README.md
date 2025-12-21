# Modal

A reusable, accessible, and theme-aware modal dialog component. This component displays content in a layer above the application, handling backdrop interactions, focus management, and screen locking.

## Features

- **Accessibility**: Includes ARIA attributes (`role="dialog"`, `aria-modal`) and keyboard navigation support.
    
- **Keyboard Interaction**: Automatically closes when the `Escape` key is pressed.
    
- **Scroll Locking**: Prevents the background body content from scrolling while the modal is open.
    
- **Backdrop Support**: Closes when clicking the dimmed background area (but not the modal content itself).
    
- **Theme Aware**: Uses CSS modules for styling, compatible with the application's theming strategy.
    

## Usage

TypeScript

```
import { useState } from 'react';
import { Modal } from './components/molecules/Modal/Modal';
import { Button } from './components/atoms/Button/Button';

const ExampleComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </Button>

      <Modal 
        isOpen={isModalOpen} 
        title="Confirm Action" 
        onClose={() => setIsModalOpen(false)}
      >
        <div className="modal-body">
          <p>Are you sure you want to proceed with this action?</p>
          <div className="modal-actions">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
```

## Props

| **Prop Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | Yes | Controls the visibility of the modal. |
| `title` | `string` | Yes | The text displayed in the modal header. |
| `onClose` | `() => void` | Yes | Function called when the user requests to close the modal (via backdrop click, close button, or Escape key). |
| `children` | `React.ReactNode` | Yes | The content to render inside the modal body. |

## Styling

The component utilizes `Modal.module.css` for encapsulation.

- **Backdrop**: Covers the entire screen with a semi-transparent overlay.
    
- **Container**: Centered vertically and horizontally.
    
- **Animation**: Logic for open states is handled via the `isOpen` prop, toggling the `styles.open` class on the backdrop.
    

## Accessibility Notes

- **Focus**: The modal container receives focus automatically when opened to assist screen readers.
    
- **Body Scroll**: The component creates a side effect that sets `document.body.style.overflow = 'hidden'` on mount (if open) and cleans it up on unmount or close.