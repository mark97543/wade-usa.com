# 📦 Card Component (`Card.tsx`)

**Path:** `src/components/molecules/Card/Card.tsx`

**Role:** Presentational Wrapper

**Philosophy:** Consistent Surface Container

## 1\. Overview and Philosophy

The **Card** component is the fundamental building block for content layout. It provides a consistent "surface" for the application, handling borders, shadows, and background colors uniformly.

**Crucial Principle:** It is a flexible wrapper that cares only about **structure** and **consistency**. It does not care what content is inside it.

| **Feature** | **Status** | **Description** |
| --- | --- | --- |
| **Consistency** | Internal | Enforces global border-radius, shadow, and background (`--surface-color`). |
| **Layout** | Internal | Provides standard padding (`2rem`) around content. |
| **Customizability** | Open | Accepts `className` and `style` props for one-off overrides. |

* * *

## 2\. Prerequisites & Dependencies

To use this component, the global CSS variables must be defined (usually in `index.css`).

| **Dependency** | **Type** | **Location** |
| --- | --- | --- |
| **CSS Modules** | Styling | `./Card.module.css` |
| **CSS Vars** | Theme | `--surface-color`, `--primary-color` |

* * *

## 3\. Data Interfaces (Props API)

The component expects the following props (`CardProps`):

| **Prop** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `children` | `ReactNode` | **Yes** | The content to render inside the card. |
| `title` | `string` | No  | Optional H2 heading displayed at the top of the card. |
| `className` | `string` | No  | Additional CSS classes to append to the wrapper. |
| `style` | `CSSProperties` | No  | Inline styles for specific overrides (e.g., `width`). |

* * *

## 4\. Usage Guide & Scenarios

### Scenario A: Basic Content Container

The most common use case. Wraps content in the standard box style.

TypeScript

```
import { Card } from '@/components/molecules/Card/Card';

const MyPage = () => {
  return (
    <Card>
      <p>This is standard content inside a card.</p>
    </Card>
  );
};
```

### Scenario B: Named Section (With Title)

Use the `title` prop to automatically render a styled H2 header at the top.

TypeScript

```
<Card title="User Profile">
  <div>Name: Wade Wilson</div>
  <div>Status: Active</div>
</Card>
```

### Scenario C: Login / Centered Form

A common pattern for login screens, restricting the width.

TypeScript

```
<Card 
  title="Welcome Back" 
  style={{ maxWidth: '400px', margin: '0 auto' }}
>
  <LoginForm />
</Card>
```