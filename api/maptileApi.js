const express = require('express');
const MBTiles = require('@mapbox/mbtiles');
const path = require('path');
const router = express.Router();
const axios = require('axios');

// Path to your .mbtiles file
const mbtilesPath = path.join(__dirname, '../tiles/INDIA2.mbtiles');
// const externalTileServer = 'http://10.10.4.156:9091/data/INDIA3';

// Initialize MBTiles
const mbtiles = new MBTiles(mbtilesPath, (err) => {
  if (err) {
    console.error('Error opening .mbtiles file:', err);
  } else {
    console.log('MBTiles file loaded successfully.');
  }
});

// Route to serve vector tiles
router.get('/tiles/:z/:x/:y.pbf', (req, res) => {
  const { z, x, y } = req.params;

  mbtiles.getTile(z, x, y, (err, tile, headers) => {
    if (err) {
      if (err.message === 'Tile not found') {
        res.status(404).send('Tile not found');
      } else {
        res.status(500).send(err.message);
      }
    } else {
      res.set(headers);
      res.send(tile);
    }
  });
});


// Route to serve vector tiles
// router.get('/tiles/:z/:x/:y.pbf', async (req, res) => {
//   const { z, x, y } = req.params;

//   try {
//     // Fetch the tile from the external server
//     const response = await axios.get(`${externalTileServer}/${z}/${x}/${y}.pbf`, {
//       responseType: 'arraybuffer', // To handle binary data
//     });
    
//     // Set the appropriate headers and send the tile data
//     res.set(response.headers);
//     res.send(response.data);
//   } catch (err) {
//     if (err.response) {
//       // Handle the case when the tile is not found
//       if (err.response.status === 404) {
//         res.status(404).send('Tile not found');
//       } else {
//         res.status(err.response.status).send(err.response.statusText);
//       }
//     } else {
//       res.status(500).send(err.message);
//     }
//   }
// });

module.exports = router;
