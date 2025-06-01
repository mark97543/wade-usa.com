#!/bin/bash

#  V-5/31/25 : Initial Version
# V-6/1/25 : Added Kitty Terminal with seperate dev view with tabs

# ----- Set the title for THIS terminal window -----
printf "\033]0;WadeUSA Dev\007" # <--- SETS THE TITLE


# ----- Constants -----
DEV_WINDOW="Local DEV"
PROJECT_DIR="/home/mark/Documents/wade-usa.com"
HTOP_WINDOW_TITLE="Local System Moniter"
SERVER_FILE="/home/mark/Documents/wade-usa.com/server"
SERVER_WINDOW="Local SERVER"
CLIENT_FILE="/home/mark/Documents/wade-usa.com/client"
CLIENT_WINDOW="Local Client"
DEV_URL="http://localhost:5174/"
DB_URL="https://wade-usa.com/directus/admin/"
CLIENT_DEPLOY="Deploying Client"

# Define the sequence of commands to run on the remote server
REMOTE_MAINTENANCE_CMDS="echo '--- Starting Droplet Maintenance ---'; \
echo '--- Updating package lists ---'; \
sudo apt update && \
echo '--- Upgrading packages (-y for non-interactive) ---'; \
sudo apt upgrade -y && \
echo '--- System updated and upgraded. Rebooting server now! ---'; \
sudo reboot"

# region ----- Functions -----
open_VS () {
  echo "Attempting to open VS Code for Project at: $PROJECT_DIR"
  #Check if the directory exists
  if [ -d "$PROJECT_DIR" ]; then
      code "$PROJECT_DIR"
      echo "VS Code should be opening."
  else
      echo "Error: Project directory not found at '$PROJECT_DIR'"
      echo "Please check the PROJECT_DIR variable in the script."
  fi
  sleep 2
}

clear_screen() {
  clear
}


open_dev () {


  kitty -o allow_remote_control=yes --listen-on unix:/tmp/kitty_window_Dev --title "$DEV_WINDOW" &
  sleep 0.5
  kitty @ --to unix:/tmp/kitty_window_Dev launch --type=tab --tab-title="$HTOP_WINDOW_TITLE" htop 
  sleep 0.5
  kitty @ --to unix:/tmp/kitty_window_Dev launch --type=tab --tab-title="$SERVER_WINDOW" --cwd "$SERVER_FILE" bash -c "nodemon run server.js; exec bash"
  sleep 0.5
  kitty @ --to unix:/tmp/kitty_window_Dev launch --type=tab --tab-title="$CLIENT_WINDOW" --cwd "$CLIENT_FILE" bash -c "npm run dev; exec bash"
  sleep 0.5
  kitty @ --to unix:/tmp/kitty_window_Dev close-tab --match "index:0"
  sleep 1
  google-chrome "$DEV_URL"
  google-chrome "$DB_URL"
  google-chrome "https://gemini.google.com/"


}

git_add_commit_push () {
   echo ""
   echo "--- Git Add, Commit, Push ---"

  # First, check if PROJECT_DIR exists and is a git repository
  if [ ! -d "$PROJECT_DIR" ]; then
      echo "Error: Project directory '$PROJECT_DIR' not found."
      read -p "Press [Enter] to return to menu..."
      return 1 # Exit the function
  fi

  if [ ! -d "$PROJECT_DIR/.git" ]; then
      echo "Error: '$PROJECT_DIR' does not appear to be a Git repository (no .git folder)."
      read -p "Press [Enter] to return to menu..."
      return 1 # Exit the function
  fi

  echo "Changing to directory: $PROJECT_DIR"
  cd "$PROJECT_DIR" 

  echo ""
  echo "Running 'git status -s (short status)..."
  git status -s
  echo ""

  echo "Running 'git add .' to stage all changes ..."
  git add . 
  echo "Stageing Complete."

  #get commit message
  read -p "Enter your commit message: " commit_message

  # Check if commit message is empty
  if [ -z "$commit_message" ]; then
      echo "Commit message cannot be empty. Aborting commit."
      # cd - > /dev/null # Optionally cd back to original PWD before function call
      read -p "Press [Enter] to return to menu..."
      return 1 # Exit the function
  fi

  #Commit Changes
  echo "Commiting shanges with message: \"$commit_message\"..."
  git commit -m "$commit_message"
  echo ""

  #push changes
  echo "Pushing changes to 'origin main' ..."
  git push origin main

  echo ""
  echo "-- Git Add, Commit, Push process complted ---"
  read -p "Press [Enter] to return to menu..."
}


echo "DEBUG: All functions defined." # <-- ADD THIS

#endregion ----- Functions -----

# ----- Main Script Logic -----
while true; do
  echo "==================================="
  echo " WadeUSA Development Script Menu "
  echo "==================================="
  echo "Today Is:"
  date #Command Line For Date

  echo "1. Open Project In VS Code"
  echo "2. Start Full Development Environment"
  echo "3. Commit Changes"
  echo "c. Clear Screen"
  echo "q. Quit"
  echo "-----------------------------------"

  # ------------------Read user's choice
  read -p "Enter your choice: " user_choice
  echo # Add a blank line for readability

  case $user_choice in

    1)
    open_VS
    ;;

    2)
    open_dev
    ;;

    3)
    git_add_commit_push
    ;;

    c | C)
    clear_screen
    ;;
    
    q | Q)
    echo "Exiting script"
    exit 0
    ;;
  esac
done






#Dependencies
# sudo apt update
# sudo apt install tmux


