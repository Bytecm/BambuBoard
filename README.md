# BambuBoard
Bambu Dashboard for viewing real-time data from the Bambu X1 Carbon 3D printer. Are you looking for the best Bambu printer OBS overlay? Scroll to the bottom, we also have OBS support! Check out a live stream here: https://www.youtube.com/channel/UChDOFv_-8TxYOfkteSlvAqA/live

# Screenshots:

Screenshot (Updated version: 1/14/24):
![image](https://github.com/t0nyz0/BambuBoard/assets/63085518/33ebcaa1-a80b-4372-b218-1b22901b0695)



# BambuBoard Setup Guide
Welcome to the BambuBoard Setup Guide. This document will walk you through the process of installing BambuBoard.
You have two options for installation: Docker or manual installation. The Docker installation is recommended for most users, as it is easier and more reliable.
However, if you prefer to install BambuBoard manually, you can follow the manual installation instructions below.
The Manual Installation is crafted for Raspberry Pi, but can be used on any Linux system.

For the Raspberry Pi I recommend using the manual installation.

# Docker Installation
1. Install Docker, please refer to the official Docker documentation for installation instructions: https://docs.docker.com/get-docker/
2. Navigate to the directory where you want to clone the repository:
   ```
   cd /path/to/directory
   ```
3. Clone the repository:
   ```
   git clone https://github.com/t0nyz0/BambuBoard.git
   ```
4. Change into the cloned repository's directory:
   ```
   cd BambuBoard
   ```
5. Edit the docker-compose.yml file and update the environment variables to your settings. You only need to update the values which are in [] brackets.
   ```
   nano docker-compose.yml
   ```
   Note: CTRL+X to exit nano, make sure to hit Y to confirm saving changes.
6. Run the application:
   ```
   docker-compose up -d
   ```
   This will build the docker image, install the dependencies and start the application.
7. Access the BambuBoard dashboard via a web browser on the same network. Open your browser and navigate to:
   ```
    http://[your ip]:8080
    ```
    Replace `8080` with the actual port number if BambuBoard runs on a different port. (Configured with the BAMBUBOARD_HTTP_PORT environment variable)
   

## Step 1: Install Node.js

Node.js is required to run the BambuBoard application. Here's how to install it on your Raspberry Pi:

1. Open a terminal on your Raspberry Pi.
2. Update your package list:
   ```
   sudo apt update
   ```
3. Upgrade your packages to their latest versions:
   ```
   sudo apt full-upgrade
   ```
4. Install Node.js:
   ```
   sudo apt install nodejs
   ```
5. **Optional** Install npm, Node.js' package manager:
   ```
   sudo apt install npm
   ```
6. Verify the installation by checking the version of Node.js and npm:
   ```
   node -v
   npm -v
   ```

## Step 2: Clone the BambuBoard Repository

To get the BambuBoard code, you need to clone its repository from GitHub:

1. Navigate to the directory where you want to clone the repository:
   ```
   cd /path/to/directory
   ```
2. Clone the repository:
   ```
   git clone https://github.com/t0nyz0/BambuBoard.git
   ```
3. Change into the cloned repository's directory:
   ```
   cd BambuBoard
   ```
4. Create a config.json file:
   ```
   cp config.json.example config.json
   ```

5. Update the config with your settings! This is important.
   ```
   nano config.json
   ```
  Note: CTRL+X to exit nano, make sure to hit Y to confirm saving changes.

  You can also overwrite the config with the following Environment Variables:
  ```
  BAMBUBOARD_API_PORT (default 3000)
  BAMBUBOARD_HTTP_PORT (default 8080)
  BAMBUBOARD_PRINTER_URL
  BAMBUBOARD_PRINTER_PORT
  BambuBoard_printerSN
  BambuBoard_printerAccessCode
  BambuBoard_bambuUsername
  BambuBoard_bambuPassword
  BambuBoard_useFahrenheit
  BambuBoard_use12HourFormat
  ```
  (The config.json must exist or BambuBoard will not start)
  

## Step 3: Install Dependencies

BambuBoard may have Node.js dependencies that need to be installed:

1. Within the BambuBoard directory, install the dependencies:
   ```
   npm install
   ```

## Step 4: Run the Application

To start the BambuBoard dashboard:

1. Run the application:
   ```
   npm run start
   ```

## Step 5: Accessing the Dashboard

Once the application is running, you can access the BambuBoard dashboard via a web browser on the Raspberry Pi or another device on the same network. Open your browser and navigate to:
   ```
   http://[your ip]:8080
   ```
Replace `8080` with the actual port number if BambuBoard runs on a different port. (Configured in bambuConnection.js)

Note: For raspberry pi you can try raspberrypi.local instead of the IP address.

## Troubleshooting

If you encounter any issues, consider the following:

- Check that you have the correct permissions to clone the repository and install Node.js packages.
- Verify that the firewall settings are not blocking the BambuBoard application.



## OBS mode

OBS widgets are now supported as of 2024-01-07.

![image](https://github.com/t0nyz0/BambuBoard/assets/63085518/6a8f19e5-6c56-43e4-8c77-a0e36ca53f13)



I have provided a sample scene file that you can import into OBS, using "Scene Collection > Import".

Note: Before importing, you will need to open the JSON and replace the IP address listed with your server IP. 
Also make sure to update the media feed to the ffmpeg provided to you from the Bambu software folder. Please refer to the Bambu GO Live documentation for more: https://wiki.bambulab.com/en/software/bambu-studio/virtual-camera

In the "OBS_Settings" folder in the project root you will find the scene file for importing. If you run into any widgets not working, first check case sensitivity of the widget URL's. Depending on setup this can be an issue. 

List of all widget addresses:
```
"AMS widget": "http://127.0.0.1:8080/widgets/ams/index.html"
"Bed Temp widget": "http://127.0.0.1:8080/widgets/bed-temp/index.html"
"Chamber Temp widget": "http://127.0.0.1:8080/widgets/chamber-temp/index.html"
"Fan widget": "http://127.0.0.1:8080/widgets/fans/index.html"
"Model image widget": "http://127.0.0.1:8080/widgets/model-image/index.html"
"Nozzle temperature widget": "http://127.0.0.1:8080/widgets/nozzle-temp/index.html"
"Nozzle info widget": "http://127.0.0.1:8080/widgets/nozzle-info/index.html"
"Print info widget": "http://127.0.0.1:8080/widgets/print-info/index.html"
"Progress bar widget": "http://127.0.0.1:8080/widgets/progress-info/index.html"
"Wifi widget": "http://127.0.0.1:8080/widgets/wifi/index.html"
"Notes EDIT widget": "http://127.0.0.1:8080/widgets/notes/edit.html"
"Notes VIEW widget": "http://127.0.0.1:8080/widgets/notes/index.html"
"Version widget": "http://127.0.0.1:8080/widgets/version/index.html"
```

Note: If you want to EDIT notes go to this URL: http:/{server}:8080/widgets/notes/edit.html

# Future Development Plans:

- Celcius / Fahrenheit preference setting
- Better settings configuration
- Add AMS humidty / temp
- AMS Active tray tracking

# Known Limitations:

The AMS (Automated Material System) filament remaining percentage displayed on the dashboard may not always be 100% accurate, as the printer estimates filament usage.
Stay tuned for updates and enhancements to BambuBoard, and feel free to contribute to its development. Your feedback and suggestions are always welcome!
