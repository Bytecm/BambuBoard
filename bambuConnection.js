//-------------------------------------------------------------------------------------------------------------
/// Configure your settings here:
const config = require('./config.json');

const BambuBoardAPIPort = process.env.BAMBUBOARD_API_PORT || config.BambuBoard_APIPort; // Checks for API_PORT in environment variables, if not found uses config.APIPort
const httpPort = process.env.BAMBUBOARD_HTTP_PORT || config.BambuBoard_httpPort; // Checks for HTTP_PORT in environment variables, if not found uses config.httpPort
const printerURL = process.env.BAMBUBOARD_PRINTER_URL || config.BambuBoard_printerURL; // Checks for PRINTER_URL in environment variables, if not found uses config.printerURL
const printerPort = process.env.BAMBUBOARD_PRINTER_PORT || config.BambuBoard_printerPort; // Checks for PRINTER_PORT in environment variables, if not found uses config.printerPort
const printerSN = process.env.BAMBUBOARD_PRINTER_SN || config.BambuBoard_printerSN; // Checks for PRINTER_SN in environment variables, if not found uses config.printerSN
const printerAccessCode = process.env.BAMBUBOARD_PRINTER_ACCESS_CODE || config.BambuBoard_printerAccessCode; // Checks for PRINTER_ACCESS_CODE in environment variables, if not found uses config.printerAccessCode
const bambuUsername = process.env.BAMBUBOARD_BAMBU_USERNAME || config.BambuBoard_bambuUsername; // Checks for BAMBU_USERNAME in environment variables, if not found uses config.bambuUsername
const bambuPassword = process.env.BAMBUBOARD_BAMBU_PASSWORD || config.BambuBoard_bambuPassword; // Checks for BAMBU_PASSWORD in environment variables, if not found uses config.bambuPassword
const useFahrenheit = process.env.BAMBUBOARD_USE_FAHRENHEIT || config.BambuBoard_useFahrenheit; // Checks for USE_FAHRENHEIT in environment variables, if not found uses config.useFahrenheit
const use12HourFormat = process.env.BAMBUBOARD_USE_12HOUR_FORMAT || config.BambuBoard_use12HourFormat; // Checks for USE_12HOUR_FORMAT in environment variables, if not found uses config.use12HourFormat

//-------------------------------------------------------------------------------------------------------------

// Enable if you want to see console log events
const consoleLogging = false;

//-------------------------------------------------------------------------------------------------------------


// -- Dont touch below

const mqtt = require("mqtt");
const fs = require("fs");
const fsp = require('fs').promises;
const http = require("http");
const url = require("url");
const cors = require('cors');
const path = require("path");
const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());


process.env.UV_THREADPOOL_SIZE = 128;

function extractToken(cookies) {
    // Implement token extraction from the cookies string
    // This is a placeholder, actual implementation depends on the cookie format
    return cookies.split('; ').find(row => row.startsWith('token=')).split('=')[1];
}

const protocol = "mqtts";
let SequenceID = 20000;
let topic = "device/" + printerSN + "/report";
let topicRequest = "device/" + printerSN + "/request";
app.use(cors({
    origin: '*' // Set the origin that you want to allow
}));
// Build node.js http server to host dashboard login and fetch method
// Function to wrap a fetch call with a timeout
function fetchWithTimeout(url, options, timeout = 8000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
    ]);
}

let cache = {
    lastRequestTime: 0,
    data: null
};
const cacheDuration = 60000; // Cache duration set to 60 seconds

// Helper function for fetch with timeout
async function fetchWithTimeout(resource, options = {}, timeout = 7000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(resource, {
        ...options,
        signal: controller.signal
    }).then(response => {
        clearTimeout(id);
        return response;
    });
}

app.get('/get-frontend-config', (req, res) => {
    res.json({
        useFahrenheit: useFahrenheit,
        use12HourFormat: use12HourFormat,
        consoleLogging: consoleLogging
    });

});

app.get('/login-and-fetch-image', async (req, res) => {
    try {
        const currentTime = new Date().getTime();

        // Check if cached data is valid and return it if valid
        if (currentTime - cache.lastRequestTime < cacheDuration && cache.data) {
            return res.json(cache.data);
        }

        if (bambuUsername != '') {
            const authResponse = await fetchWithTimeout('https://bambulab.com/api/sign-in/form', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({account: bambuUsername, password: bambuPassword, apiError: ''})
            }, 7000);

            if (!authResponse.ok) {
                throw new Error('Authentication failed');
            }

            const cookies = authResponse.headers.raw()['set-cookie'][1];
            const token = extractToken(cookies);

            const apiResponse = await fetchWithTimeout('https://api.bambulab.com/v1/user-service/my/tasks', {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`}
            }, 7000);

            if (!apiResponse.ok) {
                throw new Error('API request failed');
            }

            const data = await apiResponse.json();
            const responseObject = {
                imageUrl: data.hits[0].cover,
                modelTitle: data.hits[0].title,
                modelWeight: data.hits[0].weight,
                modelCostTime: data.hits[0].costTime,
                totalPrints: data.total,
                deviceName: data.hits[0].deviceName,
                deviceModel: data.hits[0].deviceModel,
                bedType: data.hits[0].bedType
            };

            // Update cache
            cache = {
                lastRequestTime: new Date().getTime(),
                data: responseObject
            };

            res.json(responseObject);
        } else {
            const responseObject = {
                imageUrl: 'NOTENROLLED',
                modelTitle: '',
                modelWeight: '',
                modelCostTime: '',
                totalPrints: '',
                deviceName: '',
                deviceModel: '',
                bedType: ''
            };

            // Update cache with default response
            cache = {
                lastRequestTime: new Date().getTime(),
                data: responseObject
            };

            res.json(responseObject);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

app.put('/note', async (req, res) => {
    let dataToWrite = JSON.stringify(req.body);

    try {
        await fsp.writeFile("note.json", dataToWrite);
        res.send('Note updated');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error writing note');
    }
});

app.get('/note', async (req, res) => {
    try {
        const data = await fsp.readFile("note.json", "utf8");

        res.json(JSON.parse(data));
    } catch (err) {
        console.error(err);

        if (err.code === 'ENOENT') {
            res.status(404).send('File not found');
        } else {
            res.status(500).send('Error reading the file');
        }
    }
});

app.listen(BambuBoardAPIPort, () => {
    console.log(`BambuBoard running on port ${BambuBoardAPIPort}`);
});

http
    .createServer(function (req, res) {
        const parsedUrl = url.parse(req.url);
        // extract URL path
        let pathname = `.${parsedUrl.pathname}`;

        if (pathname === "./") {
            pathname = "./index.html";
        }


        // They should not be able to read the bambuConnection parameters.
        if (pathname === "./bambuConnection.js" || pathname === "./config.json") {
            pathname = "./index.html";
        }
        const ext = path.parse(pathname).ext;
        const map = {
            ".ico": "image/x-icon",
            ".html": "text/html",
            ".js": "text/javascript",
            ".json": "application/json",
            ".css": "text/css",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".svg": "image/svg+xml",
            ".pdf": "application/pdf",
            ".doc": "application/msword",
        };

        fs.exists(pathname, function (exist) {
            if (!exist) {
                // if the file is not found, return 404
                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }

            // if is a directory search for index file matching the extension
            if (fs.statSync(pathname).isDirectory()) pathname += "/index";

            // read file from file system
            fs.readFile(pathname, function (err, data) {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    // if the file is found, set Content-type and send data
                    res.setHeader("Content-type", map[ext] || "text/plain");
                    res.end(data);
                }
            });
        });
    })
    .listen(parseInt(httpPort));

const clientId = `mqtt_${Math.random().toString(16)}`;

const connectUrl = `${protocol}://${printerURL}:${printerPort}`;

function connectClient() {
    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 3000,
        username: "bblp",
        password: printerAccessCode,
        recconectPeriod: 1000,
        rejectUnauthorized: false,
    });

    client.on("connect", () => {
        log("Client connected!");
        SequenceID = SequenceID + 1;
        client.subscribe(topic, () => {
            log(`Subscribed to topic: ${topic}`);
        });

        client.publish(
            topic,
            '{"pushing": {"command": "start", "sequence_id": ' + 0 + "}}"
        );

        const returnMsg = {
            pushing: {
                sequence_id: SequenceID,
                command: "pushall",
            },
            user_id: "9586569",
        };

        client.publish(topicRequest, JSON.stringify(returnMsg));
    });

    client.on("message", (topic, message) => {
        log(`Received message from topic: ${topic}`);

        try {
            const jsonData = JSON.parse(message.toString());

            // Check if 'print' is present in the JSON data / verifies valid data / only writes data when it sees the full structure
            const dataToWrite = JSON.stringify(jsonData);

            let lastUpdate = convertUtc(jsonData.t_utc);

            if (jsonData.print) {
                fs.writeFile("data.json", dataToWrite, (err) => {
                    if (err) {
                        log("Error writing file:" + err);
                    } else {
                        log('Data written to file');
                    }
                });
            } else {
                // Since we are only getting a date time stamp back, lets force it to send everything
                const returnMsg = {
                    pushing: {
                        sequence_id: SequenceID,
                        command: "pushall",
                    },
                    user_id: "123456789",
                };

                client.publish(topicRequest, JSON.stringify(returnMsg));
            }
        } catch (err) {
            log("Error parsing JSON:" + err);
            fs.writeFile("error.json", err, (err) => {
                if (err) {
                    log("Error writing error file: " + err);
                }
            });
        }
    });

    client.on("error", async (error) => {
        console.error(`Connection error: ${error}`);
        client.end();
        await sleep(1000);
    });

    client.on("close", async () => {
        log("Connection closed. Reconnecting...");
        await sleep(1000);
        connectClient; // Reconnect after 5 seconds
    });

    client.on("disconnect", async () => {
        log("Connection disconnected. Reconnecting...");
        await sleep(1000);
        connectClient; // Reconnect after 5 seconds
    });

    client.on("reconnect", async () => {
        log("Reconnecting...");
        await sleep(1000);
        connectClient; // Reconnect after 5 seconds
    });

    client.on("offline", async () => {
        log("Client is offline");
        await sleep(1000);
        connectClient;
    });
}

// Initial connection
connectClient();

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function convertUtc(timestampUtcMs) {
    var localTime = new Date(timestampUtcMs);

    // Formatting the date to a readable string in local time
    return localTime.toLocaleString();
}

function log(logText) {
    if (consoleLogging) {
        console.log(logText);
    }
}