# Project UPGR8: Development Guidelines

## 1. Introduction

Welcome to the UPGR8 project! This document provides guidelines for developers and AI assistants working on this codebase. Our goal is to maintain a clean, organized, and scalable project by adhering to the structures and conventions outlined below.

The project is built with a modern web stack designed for performance, developer experience, and reusability.

## 2. Core Technologies

* **Framework:** Next.js (with App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui
* **3D Graphics:** Three.js
* **Linting/Formatting:** ESLint & Prettier (as configured by Next.js)

## 3. Project Structure Overview

The primary workspace is within the `src/` directory.

upgr8/├── public/                  # Static assets (images, fonts directly served)├── src/│   ├── app/                 # Next.js App Router: pages, layouts, API routes│   │   ├── globals.css      # Global styles, Tailwind directives, CSS variables│   │   └── layout.tsx       # Root layout│   │   └── page.tsx         # Main page│   ├── components/          # All React components│   │   ├── common/          # General-purpose, reusable application components│   │   ├── icons/           # Custom SVG icons as React components│   │   ├── layouts/         # Page structure and layout components│   │   ├── three/           # Reusable Three.js scenes or components│   │   └── ui/              # Components from shadcn/ui (and custom primitives)│   ├── config/              # Project-wide configurations│   │   ├── assets.ts        # Centralized asset path management│   │   ├── colors.ts        # Color palette definitions (supplementary to Tailwind)│   │   └── fonts.ts         # Font definitions using next/font│   ├── lib/                 # Utility functions and libraries│   │   └── utils.ts         # Utility functions (e.g., cn from shadcn/ui)│   └── ...                  # Other potential directories (e.g., hooks, types)├── tailwind.config.ts       # Tailwind CSS configuration├── components.json          # shadcn/ui configuration├── tsconfig.json            # TypeScript configuration└── next.config.mjs          # Next.js configuration
### 3.1. `src/app/`
* This directory houses all routes, global styles (`globals.css`), and root layouts as per the Next.js App Router conventions.
* Define global CSS variables for colors in `globals.css` as utilized by Tailwind and shadcn/ui.

### 3.2. `src/components/`
This is the central hub for all React components. Maintain a clear separation of concerns:

* **`src/components/common/`**:
    * Use for general-purpose components that are reused across different parts of the application (e.g., `CustomButton`, `Card`, `ModalWrapper`).
    * These are typically more complex than UI primitives or are application-specific.

* **`src/components/icons/`**:
    * Store custom SVG icons converted into React components here.
    * For generic icons, prefer using `lucide-react` or a similar library first.

* **`src/components/layouts/`**:
    * Components responsible for structuring the layout of pages or sections (e.g., `MainLayout`, `Sidebar`, `Header`, `Footer`).

* **`src/components/three/`**:
    * Place reusable Three.js scenes, models, or helper components here.
    * Aim to encapsulate Three.js logic within these components to keep pages clean.

* **`src/components/ui/`**:
    * This directory is primarily managed by **shadcn/ui**. When you add a shadcn/ui component using the CLI (`npx shadcn-ui@latest add [component-name]`), it will be placed here.
    * You can also add your own custom UI primitives that follow a similar design philosophy to shadcn/ui components if needed.
    * These components should be highly reusable and presentational.

### 3.3. `src/config/`
This directory centralizes project-wide configurations that are accessible via TypeScript.

* **`src/config/assets.ts`**:
    * Define and export paths to static assets (images, videos, etc.).
    * Example:
        ```typescript
        // src/config/assets.ts
        export const AppAssets = {
          logos: {
            siteLogo: '/logos/upgr8-logo.svg',
          },
          images: {
            defaultPlaceholder: '/images/placeholder.png',
          },
        };
        ```
    * Usage: `import { AppAssets } from '@/config/assets'; <Image src={AppAssets.images.defaultPlaceholder} />`

* **`src/config/colors.ts`**:
    * While Tailwind CSS (`tailwind.config.ts` and `globals.css` CSS variables) is the primary way to manage colors, this file can be used for:
        * Exporting color names or specific shades as JavaScript constants if needed outside of Tailwind's utility classes (e.g., for dynamic JS styling or Three.js materials).
        * Defining complex color logic or mappings.
    * Always try to use Tailwind utility classes or CSS variables first.
    * Example:
        ```typescript
        // src/config/colors.ts
        export const brandColors = {
          primary: 'hsl(var(--primary))', // Mirrors CSS variable
          accent: '#FF00FF', // A specific color not in Tailwind theme (use with caution)
        };
        ```

* **`src/config/fonts.ts`**:
    * Configure and export fonts using `next/font` for optimized web font loading.
    * Example:
        ```typescript
        // src/config/fonts.ts
        import { Inter, Poppins } from 'next/font/google';

        export const fontSans = Inter({
          subsets: ['latin'],
          variable: '--font-sans', // For use in Tailwind and CSS
        });

        export const fontHeading = Poppins({
          subsets: ['latin'],
          weight: ['400', '700'],
          variable: '--font-heading',
        });
        ```
    * Apply these fonts in your root layout (`src/app/layout.tsx`) or specific components.

### 3.4. `src/lib/`
* Contains utility functions, helper modules, and library-specific configurations.
* `src/lib/utils.ts`: Includes the `cn` utility from shadcn/ui for conditional class names. Add other general-purpose utility functions here.

## 4. Working with Components

* **Reusability First:** Always aim to create components that are reusable and decoupled.
* **Props and State:** Clearly define component props using TypeScript interfaces. Manage state locally or use context/global state managers for more complex scenarios.
* **File Naming:** Use kebab-case (e.g., `user-profile-card.tsx`) or PascalCase (e.g., `UserProfileCard.tsx`) consistently for component files. For this project, we'll prefer **kebab-case** for filenames (e.g., `shape-landing-hero.tsx`) and **PascalCase** for component function names (e.g., `ShapeLandingHero`).
* **Atomic Design Principles:** Consider principles of atomic design (atoms, molecules, organisms, templates, pages) when structuring your components, especially within `src/components/common/` and `src/components/ui/`.

## 5. Styling

* **Tailwind CSS:** Primary styling tool. Utilize utility classes as much as possible.
* **`globals.css` (`src/app/globals.css`):**
    * For base styles, Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`).
    * Define global CSS variables here, especially for colors used by shadcn/ui and your Tailwind theme.
    * Example of color variables in `globals.css`:
        ```css
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          /* ... other shadcn/ui variables ... */

          /* Custom project colors */
          --brand-primary: 262.1 83.3% 57.8%; /* Example: Equivalent to an indigo */
          --brand-secondary: 340.2 92.1% 60.4%; /* Example: Equivalent to a rose */
        }
        /* Dark mode variables if applicable */
        .dark {
          --background: 222.2 84% 4.9%;
          /* ... */
        }
        ```
* **`tailwind.config.ts`**:
    * Extend Tailwind's theme (colors, spacing, typography) here.
    * Reference CSS variables defined in `globals.css` for your theme colors.
    * Example `tailwind.config.ts` color extension:
        ```typescript
        // tailwind.config.ts
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          // ...
          theme: {
            extend: {
              colors: {
                primary: 'hsl(var(--brand-primary))',
                secondary: 'hsl(var(--brand-secondary))',
                // ... other shadcn/ui theme colors
              },
              fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'], // From fonts.ts
                heading: ['var(--font-heading)', 'serif'], // From fonts.ts
              },
            },
          },
          // ...
        };
        ```

## 6. Guidelines for AI & Developers

* **Adhere to Structure:** Strictly follow the defined project structure. Place files in their designated directories.
* **Utilize Configuration Managers:**
    * For fonts, import from `src/config/fonts.ts`.
    * For static asset paths, use `src/config/assets.ts`.
    * For color constants (if needed outside Tailwind), refer to `src/config/colors.ts`. Primarily, use Tailwind classes and CSS variables.
* **Check for Existing Components:** Before creating a new component, check if a similar one already exists in `src/components/ui/` or `src/components/common/`.
* **Props Documentation:** For complex components, consider adding JSDoc comments for props.
* **Follow Import Aliases:** Use the `@/*` import alias (e.g., `import { MyComponent } from '@/components/common/my-component';`).

By following these guidelines, we can ensure UPGR8 remains a well-structured, maintainable, and enjoyable project to work on.
