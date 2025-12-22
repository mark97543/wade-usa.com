# TextArea

A multi-line text input component that maintains consistency with the application's `Input` styling. It includes built-in support for labels, error states, and responsive resizing.

## Features

- **Consistent Styling**: Matches the design system's `Input` component (colors, borders, focus states).
- **Multi-line Support**: Renders a standard HTML `<textarea>` element.
- **Integrated Label**: Automatically renders a `<label>` linked to the textarea.
- **Error Handling**: Displays validation errors and changes border color to indicate issues.
- **Resizable**: Defaults to `resize: vertical` to allow users to adjust the height.

## Usage

```tsx
import { useState } from 'react';
import { TextArea } from './components/atoms/TextArea/TextArea';

const FeedbackForm = () => {
  const [comments, setComments] = useState('');

  return (
    <form>
      {/* 1. Basic Usage */}
      <TextArea 
        label="Comments"
        placeholder="Tell us what you think..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      {/* 2. Custom Height (using rows) */}
      <TextArea 
        label="Bio"
        rows={6} 
        placeholder="Write a short biography..." 
      />

      {/* 3. Error State */}
      <TextArea 
        label="Description"
        error="Description is required."
        rows={3}
      />
    </form>
  );
};
```

## Props

The component extends `React.TextareaHTMLAttributes<HTMLTextAreaElement>`, accepting all standard textarea attributes.

| **Prop Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `label` | `string` | No  | Text displayed above the text area. |
| `error` | `string` | No  | Validation error message displayed below the field. |
| `id` | `string` | No  | Unique identifier. Falls back to `name` if omitted. |
| `className` | `string` | No  | Additional CSS classes for the container. |
| `rows` | `number` | No  | Sets the initial visible number of lines. |
| `...props` | `HTMLAttributes` | No  | Standard props like `placeholder`, `disabled`, `maxLength`, etc. |

## Styling

The component uses `TextArea.module.css`.

- **.input**: Includes `resize: vertical` and `min-height: 100px` to ensure usability as a text block.