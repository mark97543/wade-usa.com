#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Navigate to the Monorepo Root (2 levels up)
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

while true; do
    clear
    echo "================================="
    echo "       Development Menu          "
    echo "================================="
    echo "1. Run ALL Local Dev Servers (npm run dev)"
    echo "2. Run Docker Stack (docker compose up)"
    echo "3. Back to Main Menu"
    echo "================================="
    read -p "Enter your choice [1-3]: " choice

    case $choice in
        1)
            echo "Scanning services..."
            # Find all directories in 'services' that contain a package.json
            # We look 2 levels deep max to find services/frontend-main/package.json
            SERVICES=$(find "$PROJECT_ROOT/services" -maxdepth 2 -name "package.json")

            if [ -z "$SERVICES" ]; then
                echo "No services found!"
            else
                for pkg in $SERVICES; do
                    # Get the directory containing the package.json
                    SERVICE_DIR=$(dirname "$pkg")
                    # Get the folder name (e.g., frontend-main) for the window title
                    SERVICE_NAME=$(basename "$SERVICE_DIR")

                    echo "Launching $SERVICE_NAME..."
                    
                    # Launch a new terminal window/tab for this service
                    # We cd into the dir and run npm run dev
                    gnome-terminal --tab --title="$SERVICE_NAME" -- bash -c "cd '$SERVICE_DIR' && echo 'Starting $SERVICE_NAME...' && npm run dev; exec bash"
                done
                echo "All services launched!"
            fi
            read -p "Press Enter to continue..."
            ;;
        2)
            echo "Starting Docker Environment..."
            # Opens Docker logs in a new window so it doesn't block this menu
            gnome-terminal --title="Docker Logs" -- bash -c "cd '$PROJECT_ROOT' && docker compose up; exec bash"
            read -p "Press Enter to continue..."
            ;;
        3)
            break
            ;;
        *)
            echo "Invalid option."
            read -p "Press Enter to continue..."
            ;;
    esac
done