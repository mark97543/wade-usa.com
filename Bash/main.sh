#!/bin/bash

# Set the window title
echo -ne "\033]0;Wade Development\007"

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

while true; do
    clear
    echo "================================="
    echo "       Wade Development          "
    echo "================================="
    echo "1. Deployment Options"
    echo "2. Git Options"
    echo "3. Exit"
    echo "================================="
    read -p "Enter your choice [1-3]: " choice

    case $choice in
        1)
            # Check if SSH.sh exists and is executable
            if [ -f "$SCRIPT_DIR/Subscirpts/SSH.sh" ]; then
                chmod +x "$SCRIPT_DIR/Subscirpts/SSH.sh"
                "$SCRIPT_DIR/Subscirpts/SSH.sh"
            else
                echo "Error: Subscirpts/SSH.sh not found!"
                read -p "Press Enter to continue..."
            fi
            ;;
        2)
            # Check if Git.sh exists and is executable
            if [ -f "$SCRIPT_DIR/Subscirpts/Git.sh" ]; then
                chmod +x "$SCRIPT_DIR/Subscirpts/Git.sh"
                "$SCRIPT_DIR/Subscirpts/Git.sh"
            else
                echo "Error: Subscirpts/Git.sh not found!"
                read -p "Press Enter to continue..."
            fi
            ;;
        3)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            read -p "Press Enter to continue..."
            ;;
    esac
done
