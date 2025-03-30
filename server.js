const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const JavaScriptObfuscator = require("javascript-obfuscator");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
    origin: '*', // Allow all origins (not recommended for production)
}));

// Serve static files from the 'css', 'styles', and 'icons' directories
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/vectormap/icons', express.static(path.join(__dirname, 'icons')));
// app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.get('/get-ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.json({ ip: ip });
});

// Serve and obfuscate JavaScript files from the 'scripts' directory
app.get('/scripts/*', (req, res, next) => {
    const filePath = path.join(__dirname, 'scripts', req.params[0]); // Use req.params[0] to get the script name
    console.log(`Requesting: ${filePath}`); // Log the requested file path

    // Check if the requested file exists and is a .js file
    if (fs.existsSync(filePath) && filePath.endsWith('.js')) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file: ${err}`); // Log the error
                return res.status(500).send('Error reading file');
            }

            // Obfuscate the JavaScript file
            const obfuscatedCode = JavaScriptObfuscator.obfuscate(data, {
                compact: true,
                controlFlowFlattening: true,
            }).getObfuscatedCode();

            // Send the obfuscated code to the client
            res.setHeader('Content-Type', 'application/javascript');
            res.send(obfuscatedCode);
        });
    } else {
        console.error(`File not found: ${filePath}`); // Log if file is not found
        next(); // If the file doesn't exist or isn't a JS file, pass control to the next middleware
    }
});

// Serve the 'map.html' file
app.get("/vectormap", (req, res) => {
    res.sendFile(path.join(__dirname, 'map.html'));
});

// Serve and obfuscate the map API script
app.get('/vectormap/api/mapApi', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress; // Get client IP
  console.log(`Client IP (mapApi): ${clientIp}`); // Log client IP

    const filePath = path.join(__dirname, './api/mapApi.js');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        // Obfuscate the map API script
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(data, {
            compact: true,
            controlFlowFlattening: true,
        }).getObfuscatedCode();

        res.setHeader('Content-Type', 'application/javascript');
        res.send(obfuscatedCode);
    });
});

// Serve and obfuscate the latlonmap API script
app.get('/iMargmap/mapApi', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress; // Get client IP
  console.log(`Client IP (latlonmapApi): ${clientIp}`); // Log client IP

    const filePath = path.join(__dirname, './api/latlonmapApi.js');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        // Obfuscate the map API script
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(data, {
            compact: true,
            controlFlowFlattening: true,
        }).getObfuscatedCode();

        res.setHeader('Content-Type', 'application/javascript');
        res.send(obfuscatedCode);
    });
});

//-------------------------API routes-----------------
const apiRoutes = require('./api');
const searchRoutes = require('./api/searchApi');
const binduRouter = require('./api/binduApi');
const maptileApi = require('./api/maptileApi');

app.use('/api', apiRoutes);
app.use('/api', searchRoutes);
app.use('/api', binduRouter);
app.use('/api', maptileApi);

//------------------Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
