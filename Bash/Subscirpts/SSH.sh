#!/bin/bash

while true; do
    clear
    echo "================================="
    echo "       Deployment Options        "
    echo "================================="
    echo "1. SSH to Server (Console)"
    echo "2. Deploy Updates & Rebuild"
    echo "3. Back"
    echo "================================="
    read -p "Enter your choice [1-3]: " choice

    case $choice in
        1)
            echo "Launching SSH session in new window..."
            # Launch new gnome-terminal window with title and ssh command
            gnome-terminal --title="Wade Server Console" -- bash -c "ssh wade@138.68.228.190; exec bash"
            ;;
        2)
            echo "Launching Deployment Sequence..."
            # 1. SSH into server
            # 2. Navigate to project root
            # 3. Pull changes from git
            # 4. Rebuild and restart containers using production env
            # 5. Pause to let you read the logs
            gnome-terminal --title="Deploying Updates" -- bash -c "ssh wade@138.68.228.190 'cd /opt/wade-usa && git pull origin main && docker compose --env-file .env.production up -d --build'; echo '-----------------------------------'; echo 'Deployment Complete. Press Enter to close.'; read"
            ;;
        3)
            break
            ;;
        *)
            echo "Invalid option. Please try again."
            read -p "Press Enter to continue..."
            ;;
    esac
done