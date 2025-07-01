Excellent question. "Installing" a new workspace in a `pnpm` monorepo is less about running a single command and more about creating the right folder structure and configuration file. It's a simple, manual process.

Here’s how you do it, using your "travel-planner" app as the example.

* * *

### Step 1: Create the Directory

First, you need to create a new folder for your app. Based on your project's structure, new features belong in the `packages/features` directory.

- Create a new folder: `packages/features/travel-planner`

* * *

### Step 2: Create a `package.json` File

Every workspace needs its own `package.json` file to declare its name and dependencies. Create a new `package.json` file inside the folder you just made.

**File**: `packages/features/travel-planner/package.json`

JSON

```
{
  "name": "@wade-usa/feature-travel-planner",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.js",
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.23.1",
    "@wade-usa/auth": "workspace:*"
  }
}
```

**Key Points:**

- **`"name"`**: Giving it a scoped name like `@wade-usa/feature-travel-planner` is a best practice that keeps your packages organized and prevents naming conflicts.
    
- **`"private": true`**: This prevents you from accidentally publishing this package to the public npm registry.
    
- **`"workspace:*"`**: This is special `pnpm` syntax. It tells `pnpm` to link to the `@wade-usa/auth` package that exists *within your monorepo*, rather than trying to download it from the internet.
    

* * *

### Step 3: Check Your `pnpm-workspace.yaml`

This is the most important step. This file tells `pnpm` which folders to treat as workspaces. Your current file is already set up perfectly to automatically include your new package.

**File**: `pnpm-workspace.yaml`

YAML

```
packages:
  - 'apps/*'
  - 'packages/*'
```

The `packages/*` line is a wildcard that means "treat every folder inside the `packages` directory as a workspace." Since you created your new app in `packages/features/travel-planner`, `pnpm` will find it automatically. You don't need to change this file.

* * *

### Step 4: Run the Install Command

Finally, from the **root directory** of your entire project, run the install command.

Bash

```
pnpm install
```

This command will read your `pnpm-workspace.yaml` file, discover the new `@wade-usa/feature-travel-planner` package, and link it to the rest of your monorepo. After it finishes, you'll be able to import components from your new travel planner into your `shell` app, just like you do with your other packages.