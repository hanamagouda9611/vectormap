import { initializeMap } from './map.js'; // Ensure correct path

let currentMarker = null;

// Initialize the map
initializeMap().then(map => {
 // --Function to handle the search operation
    async function fetchSuggestions(query) {
        const suggestionsList = document.getElementById('suggestions-list');
        
        if (query.length === 0) {
            suggestionsList.innerHTML = ''; // Clear suggestions when input is empty
            return;
        }

        try {
            const response = await fetch(`/api/search?q=${query}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const results = await response.json();
            
            // console.log('Suggestions results:', results);

            suggestionsList.innerHTML = ''; // Clear previous suggestions

            if (results.length > 0) {
                results.forEach(location => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = location.name;
                    suggestion.onclick = () => {
                        document.getElementById('search-input').value = location.name;
                        suggestionsList.innerHTML = ''; // Clear suggestions
                    };
                    suggestionsList.appendChild(suggestion);
                });
            } else {
                // Display "No results found" if there are no suggestions
                const noResults = document.createElement('div');
                noResults.textContent = 'No results found.';
                suggestionsList.appendChild(noResults);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    async function performSearch(query) {
        if (query.length === 0) return;

        try {
            const response = await fetch(`/api/search?q=${query}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const results = await response.json();
            // console.log('Search results:', results);

            document.getElementById('suggestions-list').innerHTML = ''; // Clear suggestions

            if (results.length > 0) {
                if (currentMarker) {
                    currentMarker.remove();
                }

                const firstLocation = results[0];
                map.flyTo({
                    center: [firstLocation.lng, firstLocation.lat],
                    zoom: 5,
                });

                currentMarker = new maplibregl.Marker().setLngLat([firstLocation.lng, firstLocation.lat]).addTo(map);
            } else {
                console.log('No results found');
            }
        } catch (error) {
            console.error('Error performing search:', error);
        }
    }

    // Attach event listener to the search button
    document.getElementById('search').addEventListener('click', () => {
        const query = document.getElementById('search-input').value.trim();
        performSearch(query);
    });

    // Attach event listener to the clear button
    document.getElementById('clear').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('suggestions-list').innerHTML = '';
        if (currentMarker) {
            currentMarker.remove();
            currentMarker = null;
        }
    });

    // Attach event listener to input field to fetch suggestions
    document.getElementById('search-input').addEventListener('input', function() {
        const query = this.value.trim();
        fetchSuggestions(query);
    });

//-------------------------bindu------------------------
    document.getElementById('search-input').addEventListener('input', async () => {
        const searchInput = document.getElementById('search-input').value;
      
        // Clear any existing suggestions
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';
      
        if (!searchInput) {
          suggestionsList.style.display = 'none'; // Hide suggestions if input is empty
          return;
        }
      
        try {
          // Call the backend API with the search query
          const response = await fetch(`/api/bindu?search=${encodeURIComponent(searchInput)}`);
      
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
      
          const data = await response.json();
      
          // Check if any matching results
          if (data.matchingResults && data.matchingResults.length > 0) {
            suggestionsList.style.display = 'block'; // Show suggestions when there are results
            data.matchingResults.forEach(result => {
              const listItem = document.createElement('div');
              listItem.className = 'suggestion-item';
      
              // Construct the result based on available data (CITY, STATE, etc.)
              const city = result.CITY ? `<strong>City:</strong> ${result.CITY}` : '';
              const poiname = result.POI_NAME ? `<strong>Poi_name:</strong> ${result.POI_NAME}` : '';
              const locality = result.LOCALITY ? `<strong>loca:</strong> ${result.LOCALITY}` : '';
              const state = result.STATE ? `<strong>State:</strong> ${result.STATE}` : '';
              
              listItem.innerHTML = `${city} <br/> ${poiname} <br/> ${locality} <br/> ${state}`;
    
              suggestionsList.appendChild(listItem);
      
              // Add click event to each suggestion
              listItem.addEventListener('click', () => {
                document.getElementById('search-input').value = result.CITY || result.STATE || result.POI_NAME || result.LOCALITY;
                suggestionsList.innerHTML = ''; // Clear suggestions after selection
                suggestionsList.style.display = 'none'; // Hide the suggestions list after selection
                console.log(`Selected result: ${result.CITY || result.STATE || result.POI_NAME}`);
              }); 
            });
          } else {
            suggestionsList.style.display = 'none'; // Hide suggestions if no matching results
          }
        } catch (error) {
          console.error('Error:', error.message);
          suggestionsList.innerHTML = '<div class="error">Error fetching results. Please try again later.</div>';
          suggestionsList.style.display = 'block'; // Show error message
        }
    });
    
    // Clear search input and suggestions on clear button click
    document.getElementById('clear').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('suggestions-list').innerHTML = '';
        document.getElementById('suggestions-list').style.display = 'none'; // Hide suggestions on clear
    });
    

    
    // Clear the search input field on page load
    window.onload = () => {
        document.getElementById('search-input').value = '';
    };

});
