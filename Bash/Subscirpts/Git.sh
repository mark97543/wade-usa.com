#!/bin/bash


# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to the project root directory
cd "$SCRIPT_DIR/../../" || exit

# Load .env file from project root
if [ -f ".env" ]; then
    # Export variables from .env
    set -a
    source ".env"
    set +a
fi
while true
do
    clear
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║    Wade Dev: Git Menu                                                        ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Current Working Directory: $(pwd)"
    echo ""
    echo "Please Select an Option"
    echo ""
    echo "1. Local Commit"
    echo "2. Push to GitHub (Option 1 Needs to be done 1st)"
    echo "3. Git Log"
    echo "4. Quit"
    echo ""

    read -p "Enter your choice: " OPTION

    case "$OPTION" in
        1)
            echo "Running git add."
            git add .
            read -p "Enter Commit Title: " TITLE
            git add . 
            read -p "Enter Commit Message: " MESSAGE
            git commit -m "$TITLE: $MESSAGE"
            read -p "Press [Enter] to continue..."
            ;;
        2)
            # Check if the GIT_TOKEN variable exists.
            if [ -z "$GIT_TOKEN" ]; then
                echo "Error: GIT_TOKEN is not set. Make sure it is defined in your .env file."
            else
                echo "Preparing to push to GitHub..."
                REMOTE_URL=$(git remote get-url origin)
                URL_WITHOUT_PROTOCOL=${REMOTE_URL#https://}
                AUTH_URL="https://${GIT_TOKEN}@${URL_WITHOUT_PROTOCOL}"

                # 1. Push to the URL
                git push "${AUTH_URL}" main
                
                # 2. FIX: Force Git to update local tracking references
                # This tells your computer: "Go check origin and see where it is now."
                git fetch origin
                
                echo "Sync complete."
            fi
            read -p "Press [Enter] to continue..."
            ;;
        3)
            git log
            read -p "Press [Enter] to continue..."
            ;;
        4)
            break
            ;;
        *)
            echo "Invalid Choice"
            read -p "Press [Enter] to coninue ..."
            ;;
        esac
done
