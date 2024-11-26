#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to remove and recreate the virtual environment
reinstall_venv() {
    echo "Removing existing virtual environment..."
    rm -rf ./Backend/venv
    echo "Creating the virtual environment..."
    python3 -m venv ./Backend/venv
    source ./Backend/venv/bin/activate
    echo "Installing Python requirements..."
    pip install -r ./Backend/requirements.txt
}

# Function to remove and reinstall node_modules
reinstall_npm() {
    echo "Navigating to Frontend directory..."
    cd ./Frontend/
    echo "Removing existing node_modules directory..."
    rm -rf node_modules
    echo "Installing Node.js dependencies..."
    npm install
}

# Main menu for the script
echo "Roan©2024 :)"
PS3='Please enter your choice: '
options=("Reinstall Virtual Environment" "Reinstall Node Modules" "Reinstall Both" "Exit")
select opt in "${options[@]}"
do
    case $opt in
        "Reinstall Virtual Environment")
            reinstall_venv
            break
            ;;
        "Reinstall Node Modules")
            reinstall_npm
            break
            ;;
        "Reinstall Both")
            reinstall_venv
            reinstall_npm
            break
            ;;
        "Exit")
            echo "Exiting script."
            exit 0
            ;;
        *) echo "Invalid option $REPLY";;
    esac
done

echo "Setup complete."
