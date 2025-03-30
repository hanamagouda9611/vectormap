function loadMap(options, callback) {
    // Initialize your map here
    const map = new CustomMap({
      container: options.container || 'map',
      style: options.style || '/styles/default.json',
      zoom: options.zoom || 12,
      center: options.center || [0, 0]
    });
  
    // Call the provided callback function once the map is loaded
    map.on('load', () => {
      if (typeof window[callback] === 'function') {
        window[callback](map);
      }
    });
  }
  
  // Automatically execute the function if it's loaded with a callback
  const urlParams = new URLSearchParams(window.location.search);
  const callback = urlParams.get('callback');
  if (callback) {
    loadMap({}, callback);
  }
  