 // Function to get the current location coordinates using the Geolocation API
 function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true, // Request high accuracy
                timeout:2000, // 10 seconds timeout
                maximumAge: 0 // Do not cache the location
            });
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

// Function to get the user's public IP address
async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
}

// Integrating IP fetching with the map initialization
getIPAddress().then(ip => {
    console.log(`Your IP Address is: ${ip}`);

    // Initialize the map after IP is fetched
    initMap(function(map, position) {
        console.log(`User's IP: ${ip}, Location: Latitude: ${position.latitude}, Longitude: ${position.longitude}`);
        
        // You can also use the IP address within the map if needed.
        // e.g., displaying the IP address in a map marker popup or elsewhere
    });
});

// Example usage:
    getIPAddress().then(ip => {
        console.log('Your IP Address is: ', ip);
    });

//===================== Fetch Tiles data and libraries=================
async function fetchAndCombineStyles(urls) {
    try {
    const allStyles = await Promise.all(urls.map(url => fetch(url).then(response => response.json())));
    
    let combinedStyle = {
        "version": 8,
        "sources": {
            "map-tiles": {
                "type": "vector",
                "tiles": [
                    "http://10.10.4.156:9091/data/INDIA3/{z}/{x}/{y}.pbf"
                ],
                "minzoom": 0,
                "maxzoom": 15
            }
        },
        "layers": [],
        "glyphs": "https://api.mapbox.com/fonts/v1/mapbox/{fontstack}/{range}.pbf",
    };

    allStyles.forEach(style => {
        Object.assign(combinedStyle.sources, style.sources);
        combinedStyle.layers = combinedStyle.layers.concat(style.layers);
    });
    return combinedStyle;
}
catch (error) {
    console.error("Error fetching styles:", error);
}
}

//===================== Map initialize and map components =================
// --------------Initialize the map with the combined style ----------------
export async function initMap(callback) {
    const styleUrls = [
        // 'http://10.10.4.156:3000/styles/osm.json',
        'http://10.10.4.156:3000/styles/coastal.json',
        'http://10.10.4.156:3000/styles/country.json',
        'http://10.10.4.156:3000/styles/akshara.json',
        'http://10.10.4.156:3000/styles/bfp.json',
        'http://10.10.4.156:3000/styles/gated_commu.json',
        'http://10.10.4.156:3000/styles/road.json',
        'http://10.10.4.156:3000/styles/nilaya.json',
        'http://10.10.4.156:3000/styles/locality.json',
        'http://10.10.4.156:3000/styles/subdist.json',
        'http://10.10.4.156:3000/styles/dist.json',
        'http://10.10.4.156:3000/styles/state.json',
        'http://10.10.4.156:3000/styles/nivasa.json',
        'http://10.10.4.156:3000/styles/internal.json',    
        'http://10.10.4.156:3000/styles/access.json',
        'http://10.10.4.156:3000/styles/gates.json',
        'http://10.10.4.156:3000/styles/amenity.json',
        'http://10.10.4.156:3000/styles/road_entry.json',
        'http://10.10.4.156:3000/styles/bindu.json',
        'http://10.10.4.156:3000/styles/labels.json',
        'http://10.10.4.156:3000/styles/units.json'
    ];

    // Fetch and combine the styles
    const combinedStyle = await fetchAndCombineStyles(styleUrls);
    if (!combinedStyle) {
        console.error("Combined style is undefined.");
        return;
    }
            // Get current location coordinates
            try {
                const position = await getCurrentLocation();
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
                    
                // Initialize the map centered on the user's current location
                const map = new maplibregl.Map({
                    container: 'map',
                    style: combinedStyle,
                    zoom: 18,
                    center: [longitude, latitude], // Center the map on the exact location
                });

                // Load icons when the map finishes loading
                map.on('load', function () {
                    loadIcons(map); // Assuming loadIcons is defined elsewhere
                });

                // Place a marker on the map for the current location
                new maplibregl.Marker({ color: 'red' }) // Change color if needed
                    .setLngLat([longitude, latitude])
                    .setPopup(new maplibregl.Popup().setText(`Current Location: Latitude ${latitude}, Longitude ${longitude}`)) // Optional popup
                    .addTo(map);

                // Callback to indicate the map is ready with the current location only
                if (callback && typeof callback === 'function') {
                    callback(map, { latitude, longitude }); // Passing only the current location to the callback
                }
            } catch (error) {
                console.error('Error getting current location:', error);
            }
        }

// ------------------------- ICONS PATH ---------------------------------

// let iconsLoaded = false;
function loadIcons(map) {

    // Load the icons using the server endpoint
    const iconUrl  = {
        'AIRPORT': 'http://10.10.4.156:3000/vectormap/icons/AIRPORT.png',
        'AMUSEMENT/WATER PARK' :'http://10.10.4.156:3000/vectormap/icons/WATER_PARK.png',
        'ANIMAL PARK/ZOO':'http://10.10.4.156:3000/vectormap/icons/ZOO.png',
        'ATM':'http://10.10.4.156:3000/vectormap/icons/ATM.png',
        'AUTO DEALERSHIP':'http://10.10.4.156:3000/vectormap/icons/AUTO_DEALERSHIP.png',
        'AUTO SERVICE & MAINTENANCE':'http://10.10.4.156:3000/vectormap/icons/AUTO_SERVICE_MAINTENANCE.png',
        'AUTO/TAXI STAND': 'http://10.10.4.156:3000/vectormap/icons/AUTO_TAXI_STAND.png',
        'AUTOMOBILE ACCESSORIES':'http://10.10.4.156:3000/vectormap/icons/AUTOMOBILE_ACCESSORIES.png',
        'BANK': 'http://10.10.4.156:3000/vectormap/icons/BANK.png',
        'BAR/CLUB':'http://10.10.4.156:3000/vectormap/icons/BAR_CLUB.png',
        'BICYCLE_STORE':'http://10.10.4.156:3000/vectormap/icons/BICYCLE_STORE.png',
        'BOOK STORE':'http://10.10.4.156:3000/vectormap/icons/BOOK_STORE.png',
        'BOWLING CENTRE':'http://10.10.4.156:3000/vectormap/icons/BOWLING_CENTRE.png',
        'BUS STATION':'http://10.10.4.156:3000/vectormap/icons/BUS_TERMINAL.png',
        'BUSINESS FACILITY/OFFICE':'http://10.10.4.156:3000/vectormap/icons/BUSINESS_FACILITY_OFFICE.png',
        'CASINO':'http://10.10.4.156:3000/vectormap/icons/CASINO.png',
        'CEMETERY': 'http://10.10.4.156:3000/vectormap/icons/CEMETERY.png',
        'CINEMA':'http://10.10.4.156:3000/vectormap/icons/MOVIE_THEATRE.png',
        'CLOTHING STORE':'http://10.10.4.156:3000/vectormap/icons/CLOTHING_STORE.png',
        'COFFEE SHOP':'http://10.10.4.156:3000/vectormap/icons/COFFEE_SHOP.png',
        'CIVIC/COMMUNITY CENTRE':'http://10.10.4.156:3000/vectormap/icons/COMMUNITY.png',
        'CONSUMER ELECTRONICS STORE':'http://10.10.4.156:3000/vectormap/icons/CONSUMER_ELECTRONICS_STORE.png',
        'CONVENIENCE STORE':'http://10.10.4.156:3000/vectormap/icons/CONVENIENCE_STORE.png',
        'CONVENTION/EXHIBITION CENTRE' :'http://10.10.4.156:3000/vectormap/icons/CONVENTION.png',
        'COURT HOUSE':'http://10.10.4.156:3000/vectormap/icons/COURT.png',
        'DOMESTIC GAS':'http://10.10.4.156:3000/vectormap/icons/DOMESTIC_GAS.png',
        'ELECTRIC VEHICLE CHARGING POINT':'http://10.10.4.156:3000/vectormap/icons/ELECTRIC_VEHICLE_CHARGING_POINT.png',
        'ELECTRICAL SUPPLY STORE':'http://10.10.4.156:3000/vectormap/icons/ELECTRICAL_SUPPLY_STORE.png',
        'EMBASSY':'http://10.10.4.156:3000/vectormap/icons/EMBASSY.png',
        'FERRY TERMINAL':'http://10.10.4.156:3000/vectormap/icons/FERRY.png',
        'FIRE STATION': 'http://10.10.4.156:3000/vectormap/icons/FIRE_STATION.png',
        'GOLF COURSE':'http://10.10.4.156:3000/vectormap/icons/GOLF_COURSE.png',
        'GOVERNMENT OFFICE': 'http://10.10.4.156:3000/vectormap/icons/GOVERNMENT.png',
        'HARDWARE/ELECTRICAL':'http://10.10.4.156:3000/vectormap/icons/HARDWARE_STORES.png',
        'HIGHER EDUCATION':'http://10.10.4.156:3000/vectormap/icons/HIGHER_EDUCATION.png',
        'HISTORICAL MONUMENT':'http://10.10.4.156:3000/vectormap/icons/MONUMENT.png',
        'HOME ITEMS REPAIR SERVICES':'http://10.10.4.156:3000/vectormap/icons/HOME_ITEMS_REPAIR_SERVICES.png',
        'HOME SPECIALTY STORE':'http://10.10.4.156:3000/vectormap/icons/HOME_SPECIALTY_STORE.png',
        'HOSPITAL':'http://10.10.4.156:3000/vectormap/icons/HOSPITAL.png',
        'HOTEL':'http://10.10.4.156:3000/vectormap/icons/HOTEL.png',
        'ICE SKATING RINK':'http://10.10.4.156:3000/vectormap/icons/ICE_SKATING_RINK.png',
        'INDUSTRIAL ZONE':'http://10.10.4.156:3000/vectormap/icons/INDUSTRIAL_ZONE.png',
        'INTER STATE BUS TERMINAL':'http://10.10.4.156:3000/vectormap/icons/BUS_TERMINAL.png',
        'LANDMARK':'http://10.10.4.156:3000/vectormap/icons/LANDMARK.png',
        'LIBRARY':'http://10.10.4.156:3000/vectormap/icons/LIBRARY.png',
        'LIQUOR_SHOP':'http://10.10.4.156:3000/vectormap/icons/LIQUOR_SHOP.png',
        'MEDICAL SERVICES/CLINICS':'http://10.10.4.156:3000/vectormap/icons/MEDICAL_SERVICES_CLINICS.png',
        'METRO/LOCAL TRAIN STATION':'http://10.10.4.156:3000/vectormap/icons/METRO.png',
        'MOTORCYCLE DEALERSHIP':'http://10.10.4.156:3000/vectormap/icons/MOTORCYCLE_DEALERSHIP.png',
        'MOTORCYCLE MAINTENANCE':'http://10.10.4.156:3000/vectormap/icons/MOTORCYCLE_MAINTENANCE.png',
        'MOVERS & PACKERS':'http://10.10.4.156:3000/vectormap/icons/MOVERS_PACKERS.png',
        'MOVIE THEATRE':'http://10.10.4.156:3000/vectormap/icons/MOVIE_THEATRE.png',
        'MUSEUM':'http://10.10.4.156:3000/vectormap/icons/MUSEUM.png',
        'NAME OF INTERSECTION':'http://10.10.4.156:3000/vectormap/icons/INTERSECTION.png',
        'OFFICE SUPPLIES':'http://10.10.4.156:3000/vectormap/icons/OFFICE_SUPPLIES.png',
        'OTHER ACCOMMODATION (NOT HOTEL)':'http://10.10.4.156:3000/vectormap/icons/OTHER_ACCOMMODATION_NOT_HOTEL.png',
        'PARKS & RECREATION':'http://10.10.4.156:3000/vectormap/icons/PARK.png',
        'PERFORMING ARTS/AUDITORIUM':'http://10.10.4.156:3000/vectormap/icons/PERFORMING_ARTS_AUDITORIUM.png',
        'PETROL STATION':'http://10.10.4.156:3000/vectormap/icons/PETROL.png',
        'PHARMACY':'http://10.10.4.156:3000/vectormap/icons/PHARMACY.png',
        'PLACE OF WORSHIP':'http://10.10.4.156:3000/vectormap/icons/PLACE_OF_WORKSHIP.png',
        'POLICE STATION':'http://10.10.4.156:3000/vectormap/icons/POLICE_STATION.png',
        'POST OFFICE':'http://10.10.4.156:3000/vectormap/icons/POST_OFFICE.png',
        'PUBLIC PARKING':'http://10.10.4.156:3000/vectormap/icons/PUBLIC_PARKING.png',
        'PUBLIC REST ROOM':'http://10.10.4.156:3000/vectormap/icons/PUBLIC_REST_ROOM.png',
        'PUBLIC STOP':'http://10.10.4.156:3000/vectormap/icons/PUBLIC_STOP.png',
        'RACE TRACK':'http://10.10.4.156:3000/vectormap/icons/RACE.png',
        'RAILWAY STATION (REGULAR)':'http://10.10.4.156:3000/vectormap/icons/RAILWAY_2.png',
        'RECYCLING CENTER':'http://10.10.4.156:3000/vectormap/icons/RECYCLING_CENTER.png',
        'RENTAL CAR AGENCY':'http://10.10.4.156:3000/vectormap/icons/RENTAL_CAR_AGENCY.png',
        'RESIDENTIAL BUILDING (MAIN GATE)':'http://10.10.4.156:3000/vectormap/icons/BUILDING.png',
        'REST AREA':'http://10.10.4.156:3000/vectormap/icons/REST_AREA.png',
        'RESTAURANT':'http://10.10.4.156:3000/vectormap/icons/RESTAURANT.png',
        'SCHOOL':'http://10.10.4.156:3000/vectormap/icons/SCHOOL.png',
        'SHOPPING MARKET':'http://10.10.4.156:3000/vectormap/icons/SHOPPING_MARKET.png',
        'SPECIALTY/BRANDED STORE':'http://10.10.4.156:3000/vectormap/icons/SPECIALTY_BRANDED_STORE_PACKERS.png',
        'SPORTING GOODS STORE':'http://10.10.4.156:3000/vectormap/icons/SPORTING_GOODS_STORE.png',
        'SPORTS CENTRE/SPORTS COMPLEX':'http://10.10.4.156:3000/vectormap/icons/SPORTS.png',
        'TOLL BOOTH':'http://10.10.4.156:3000/vectormap/icons/TOLL_BOOTH.png',
        'TOURIST ATTRACTION':'http://10.10.4.156:3000/vectormap/icons/TOURIST_ATTRACTION.png',
        'TOURIST INFORMATION CENTRE':'http://10.10.4.156:3000/vectormap/icons/TOURIST_INFORMATION_CENTRE.png',
        // 'TRAINING CENTRE/INSTITUTE':'',
        'TRANSPORT CARGO BOOKING':'http://10.10.4.156:3000/vectormap/icons/TRANSPORT_CARGO_BOOKING.png',
        'TRUCK DEALERSHIP':'http://10.10.4.156:3000/vectormap/icons/TRUCK_DEALERSHIP.png',
        'USED VEHICLE DEALERSHIP':'http://10.10.4.156:3000/vectormap/icons/USED_VEHICLE_DEALERSHIP.png',
        'Entrance':'http://10.10.4.156:3000/vectormap/icons/Entrance.png',
        'barrier':'http://10.10.4.156:3000/vectormap/icons/barrier.png',
        'road':'http://10.10.4.156:3000/vectormap/icons/road.png',
        'default': 'http://10.10.4.156:3000/vectormap/icons/LANDMARK.png'
    };  

    Object.keys(iconUrl ).forEach(function(key) {
        map.loadImage(iconUrl [key], function(error, image) {
            if (error) {
                console.error('Error loading image:', iconUrl [key], error);
                return;
            }
            if (!map.hasImage(key)) {
                map.addImage(key, image);
            }
        });
    });

    // Handle missing images
    map.on('styleimagemissing', function(e) {
        var id = e.id;
        if (iconUrl [id]) {
            map.loadImage(iconUrl [id], function(error, image) {
                if (error) {
                    console.error('Error loading missing image:', iconUrl [id], error);
                    return;
                }
                if (!map.hasImage(id)) {
                    map.addImage(id, image);
                }
            });
        } else {
            console.warn('Missing icon not found in icons list:', id);
        }
    });
}

// Export the initialize function
window.initMap = initMap;
