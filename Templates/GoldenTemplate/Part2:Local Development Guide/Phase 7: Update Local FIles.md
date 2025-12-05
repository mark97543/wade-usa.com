## 🗃️ Terminal Command to Copy and Replace a Folder

You can achieve this in a single command from your project root:

Bash

```
cp -r <source_directory> <destination_directory>
```

### **Example:** Updating the `frontend-main` Components

If you created a temporary "Golden Template" component folder at the root level, and you want to copy it to update the live `frontend-main` service, you would use this structure:

| **Element**                                             | **Example Path (from Monorepo Root)** |
| ------------------------------------------------------- | ------------------------------------- |
| **Source Folder** (The new version)                     | `templates/golden-components/`        |
| **Destination Folder** (The old version to be replaced) | `services/main/src/components/`       |

The command would be:

Bash

```
cp -r templates/golden-components/ services/main/src/components/
```

| **Component**                       | **Result**                                                   |
| ----------------------------------- | ------------------------------------------------------------ |
| **`cp`**                            | The copy command.                                            |
| **`-r`**                            | **R**ecursive: This is essential. It tells `cp` to copy the entire folder and all its contents (files, subfolders, etc.). |
| **`templates/golden-components/`**  | The folder containing all your latest `atoms/`, `molecules/`, etc. |
| **`services/main/src/components/`** | The target directory. `cp` will copy the contents of the source folder *into* the destination, overwriting existing files with the same name. |

------

## 🔁 Workflow for Updating Component Instances

To follow the pattern you've established—where each subdomain has its own copy of the components—here's the repeatable process for updating multiple apps:

1. **Develop/Fix:** Make your changes inside your primary source (e.g., a dedicated `templates/components/` folder or directly inside `services/main/src/components/`).

2. **Copy the Source (Example assumes `services/main` is the source of truth):**

   Bash

   ```
   # Update App 1 (Example: services/dashboard)
   cp -r services/main/src/components/ services/dashboard/src/components/
   
   # Update App 2 (Example: services/newsite)
   cp -r services/main/src/components/ services/newsite/src/components/
   ```

3. **Commit Changes:** Commit the updates to your monorepo.

4. **Redeploy Services:** On your server, you must now rebuild and restart the affected services to apply the new code in their Docker containers.

   Bash

   ```
   # On the server (ssh wade@...)
   cd /opt/wade-usa
   git pull origin main
   
   # Rebuild and restart the main service
   docker compose --env-file .env.production up -d --build frontend-main
   
   # Rebuild and restart the other affected services
   docker compose --env-file .env.production up -d --build frontend-dashboard fronte
   ```
