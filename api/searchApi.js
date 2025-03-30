// api/search.js
const express = require('express');
const router = express.Router();

// Sample data: Replace this with your actual location data or external API calls.
const locations = [
    { name: 'New Delhi', lat: 28.6139, lng: 77.209 },
    { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    // Add more locations as needed
];

// Search endpoint
router.get('/search', (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const results = locations.filter(location => 
        location.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json(results);
});

module.exports = router;
