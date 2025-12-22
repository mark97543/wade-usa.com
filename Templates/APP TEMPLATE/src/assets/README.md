# Assets Documentation (`src/assets/`)

**Purpose:** This directory is the home for all **static media files** used in the application. If it isn't code (React/TS), and it isn't data (Directus), it belongs here.

## 📂 Recommended Structure

To keep things organized as your app grows, we recommend using subfolders:

Plaintext

```
src/assets/
├── fonts/        # Custom font files (.woff2, .ttf)
├── icons/        # SVG icons (if not using a library like Lucide/Heroicons)
├── images/       # PNG/JPG (Logos, backgrounds, placeholders)
└── styles/       # (Optional) CSS files that aren't modules (e.g., globals)
```

* * *

## 🚀 How to Use Assets

In Vite (and modern React), you import assets just like JavaScript modules.

### 1\. Images & Logos

*Best for: `png`, `jpg`, `svg` (used as images), `webp`.*

**Code Example:**

TypeScript

```
import logo from '@/assets/images/budget-logo.png';

export function Header() {
  return (
    <nav>
       <img src={logo} alt="Wade Budget" className="h-8 w-auto" />
    </nav>
  );
}
```

### 2\. SVG Icons (As Components)

*Best for: Vector graphics you want to color/size with Tailwind.*

**Option A: Import as Image (Simple)**

TypeScript

```
import icon from '@/assets/icons/trash.svg';
<img src={icon} alt="Delete" />
```

**Option B: Import as Component (Advanced)** *Requires `vite-plugin-svgr` (if configured) or manual inline SVG.*

TypeScript

```
import { ReactComponent as TrashIcon } from '@/assets/icons/trash.svg';
<TrashIcon className="text-red-500 w-6 h-6" />
```

* * *

## ⚠️ Important Rules

1.  **Do NOT store User Uploads here.**
    
    - User avatars, receipt photos, or dynamic content must live in **Directus** (the `/directus/uploads` volume). The `assets` folder is *only* for files that are part of the app's design (hardcoded).
2.  **Optimize your images.**
    
    - Large PNGs slow down the app. Use [TinyPNG](https://tinypng.com) or convert to `.webp` before adding them here.
3.  **Use the `@/` alias.**
    
    - Always import using `@/assets/...` instead of `../../assets/...`. It is cleaner and doesn't break if you move files.

* * *

## 🎨 Global Styles?

*Note: Your project uses Tailwind CSS and a Global Theme Context, so you usually won't need raw CSS files here.*

- **Global Theme:** Controlled by `src/context/ThemeContext.tsx` (fetches colors from DB).
    
- **Component Styles:** Use CSS Modules (`Button.module.css`) next to the component.
    
- **Tailwind Config:** `tailwind.config.js` in the root.