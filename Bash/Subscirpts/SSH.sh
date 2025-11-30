#!/bin/bash

while true; do
    clear
    echo "================================="
    echo "       Deployment Options        "
    echo "================================="
    echo "1. SSH as wade@138.68.228.190"
    echo "2. Back"
    echo "================================="
    read -p "Enter your choice [1-2]: " choice

    case $choice in
        1)
            echo "Launching SSH session in new window..."
            # Launch new gnome-terminal window with title and ssh command
            # We use -- bash -c "..." to keep the window open or handle the ssh session
            gnome-terminal --title="Wade Server" -- bash -c "ssh wade@138.68.228.190; exec bash"
            ;;
        2)
            break
            ;;
        *)
            echo "Invalid option. Please try again."
            read -p "Press Enter to continue..."
            ;;
    esac
done
