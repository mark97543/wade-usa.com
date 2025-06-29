### **Project #2: Teaching PNPM to Read a Map**

- **The Mission:** After telling the `shell` where to find the `home` package, our package manager, `pnpm`, claimed the package wasn't in the workspace. It was like knowing the house address but not having the right map to find the street.
    
- **The Adventure (The "Why"):** Our workspace map, `pnpm-workspace.yaml`, was only telling `pnpm` to look one folder deep inside the `packages` directory. Our `home` feature was cleverly hidden one level deeper in `packages/features/home`, a place `pnpm` wasn't looking.
    
- **The Solution (The "How"):** We gave `pnpm` a better map by updating the `pnpm-workspace.yaml` file, adding `'packages/features/*'` to the list of places to search. This allowed it to discover our nested package.