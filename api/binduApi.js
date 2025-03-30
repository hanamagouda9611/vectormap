const express = require('express');
const router = express.Router();

router.get('/bindu', async (req, res) => {
  const { search } = req.query;

  // URL of the JSON file
  const jsonFileUrl = 'http://10.10.4.156:9091/data/INDIA3.json';

  try {
    // Dynamic import of node-fetch
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(jsonFileUrl);

    if (!response.ok) {
      console.error('Error fetching JSON:', response.statusText);
      return res.status(response.status).json({ error: 'Error fetching JSON data' });
    }

    const data = await response.json();
    console.log('Fetched data:', data); // Log the fetched data

    // Access the layer data for DEDUCE_BINDU_LITE_V1_6
    const layerData = data.tilestats.layers.find(layer => layer.layer === "DEDUCE_BINDU_LITE_V1_6");

    if (!layerData) {
      return res.status(404).json({ error: 'Layer DEDUCE_BINDU_LITE_V1_6 not found.' });
    }

    const attributes = layerData.attributes || [];
    const results = [];
    console.log('Layer attributes:', attributes); // Log the layer attributes

    // Create a mapping to hold the index of values for all attributes
    const indexMap = {};

    // Build the index map for all attributes
    attributes.forEach(attr => {
      attr.values.forEach((value, index) => {
        if (!indexMap[value]) {
          indexMap[value] = {};
        }
        indexMap[value][attr.attribute] = index;
      });
    });

    // Specify the attributes to search in
    const searchableAttributes = ['POI_NAME', 'CITY', 'LOCALITY', 'STATE', 'POSTCODE', 'BUILD_LATE', 'BUILD_LONE'];
    const specificAttributes = ['POI_NAME', 'CITY', 'BUILD_LATE'];
    
    // Check if a search term was provided
    if (search) {
      console.log('Search term:', search); // Log the search term

      // Search across specified attributes for the search term
      const matchedValues = searchableAttributes.flatMap(attrName => {
        const attr = attributes.find(attr => attr.attribute === attrName);
        return attr ? attr.values.filter(value =>
          value.toLowerCase().includes(search.toLowerCase())
        ) : [];
      });

      console.log('Matched values:', matchedValues); // Log matched values

      // For each matched value, collect only specific attributes
      matchedValues.forEach(matchedValue => {
        // Create an object to hold all attributes for this matched value
        const pointData = {};

        // Collect only the specified attributes for the matched point
        specificAttributes.forEach(attrName => {
          const attr = attributes.find(attr => attr.attribute === attrName);
          if (attr) {
            const index = indexMap[matchedValue][attr.attribute];
            if (index !== undefined && attr.values[index] !== undefined) {
              pointData[attr.attribute] = attr.values[index];
            }
          }
        });

        // Only add pointData to results if it has relevant attributes
        if (Object.keys(pointData).length > 0) {
          results.push(pointData);
        }
      });

      // If no matched values, return a message
      if (results.length === 0) {
        return res.status(404).json({ message: 'No matching data found.' });
      }
    } else {
      return res.status(400).json({ error: 'Search term is required.' });
    }

    res.json({ matchingResults: results }); // Return all attributes for matching results
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error fetching JSON data' });
  }
});

module.exports = router;
