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
