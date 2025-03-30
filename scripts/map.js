//===============Fetch data or maptiles=======================  
    async function fetchAndCombineStyles(urls) {
        const allStyles = await Promise.all(urls.map(url => fetch(url).then(response => response.json())));
        
        let combinedStyle = {
            "version": 8,
            "sources": {
                "map-tiles": {
                    "type": "vector",
                    "tiles": [
                        "http://10.10.4.156:9091/data/INDIA3/{z}/{x}/{y}.pbf"
                        // "http://10.10.4.156:3000/api/tiles/{z}/{x}/{y}.pbf"
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
   
//===================== Map initialize and map components =================
// --------------Initialize the map with the combined style -------------------------
    export async function initializeMap() {
        const styleUrls = [
            // './styles/osm.json',
            './styles/coastal.json',
            './styles/country.json',
            './styles/akshara.json',
            './styles/bfp.json',
            './styles/gated_commu.json',
            './styles/road.json',
            './styles/nilaya.json',
            './styles/locality.json',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            './styles/subdist.json',
            './styles/dist.json',
            './styles/state.json',
            './styles/nivasa.json',
            './styles/internal.json',    
            './styles/access.json',
            './styles/gates.json',
            './styles/amenity.json',
            './styles/road_entry.json',
            './styles/bindu.json',
            './styles/labels.json',
            './styles/units.json'
        ];
        const combinedStyle = await fetchAndCombineStyles(styleUrls);
   
        var map = new maplibregl.Map({
            container: 'map',
            style: combinedStyle, // Apply the combined style
            zoom: 3,
            center: [78.7873, 22.9124], // Default center [lng, lat]
        });

        // let loggedLayers = false;

        // map.on('styledata', function() {
        //     if (!loggedLayers) { // Ensure this block runs only once
        //         const layers = map.getStyle().layers;
        //         layers.forEach(layer => console.log('Layer:', layer.id)); // Optional: Log each layer's ID
        //         console.log('Number of layers loaded into the map:', layers.length);
        //         loggedLayers = true; // Set flag to avoid logging multiple times
        //     }
        // });


// ------------------------- ICONS PATH ---------------------------------

    let iconsLoaded = false;
    function loadIcons() {

        // Load the icons using the server endpoint
        const iconUrl  = {
            'AIRPORT': '/vectormap/icons/AIRPORT.png',
            'AMUSEMENT/WATER PARK' :'/vectormap/icons/WATER_PARK.png',
            'ANIMAL PARK/ZOO':'/vectormap/icons/ZOO.png',
            'ATM':'/vectormap/icons/ATM.png',
            'AUTO DEALERSHIP':'/vectormap/icons/AUTO_DEALERSHIP.png',
            'AUTO SERVICE & MAINTENANCE':'/vectormap/icons/AUTO_SERVICE_MAINTENANCE.png',
            'AUTO/TAXI STAND': '/vectormap/icons/AUTO_TAXI_STAND.png',
            'AUTOMOBILE ACCESSORIES':'/vectormap/icons/AUTOMOBILE_ACCESSORIES.png',
            'BANK': '/vectormap/icons/BANK.png',
            'BAR/CLUB':'/vectormap/icons/BAR_CLUB.png',
            'BICYCLE_STORE':'/vectormap/icons/BICYCLE_STORE.png',
            'BOOK STORE':'/vectormap/icons/BOOK_STORE.png',
            'BOWLING CENTRE':'/vectormap/icons/BOWLING_CENTRE.png',
            'BUS STATION':'/vectormap/icons/BUS_TERMINAL.png',
            'BUSINESS FACILITY/OFFICE':'/vectormap/icons/BUSINESS_FACILITY_OFFICE.png',
            'CASINO':'/vectormap/icons/CASINO.png',
            'CEMETERY': '/vectormap/icons/CEMETERY.png',
            'CINEMA':'/vectormap/icons/MOVIE_THEATRE.png',
            'CLOTHING STORE':'/vectormap/icons/CLOTHING_STORE.png',
            'COFFEE SHOP':'/vectormap/icons/COFFEE_SHOP.png',
            'CIVIC/COMMUNITY CENTRE':'/vectormap/icons/COMMUNITY.png',
            'CONSUMER ELECTRONICS STORE':'/vectormap/icons/CONSUMER_ELECTRONICS_STORE.png',
            'CONVENIENCE STORE':'/vectormap/icons/CONVENIENCE_STORE.png',
            'CONVENTION/EXHIBITION CENTRE' :'/vectormap/icons/CONVENTION.png',
            'COURT HOUSE':'/vectormap/icons/COURT.png',
            'DOMESTIC GAS':'/vectormap/icons/DOMESTIC_GAS.png',
            'ELECTRIC VEHICLE CHARGING POINT':'/vectormap/icons/ELECTRIC_VEHICLE_CHARGING_POINT.png',
            'ELECTRICAL SUPPLY STORE':'/vectormap/icons/ELECTRICAL_SUPPLY_STORE.png',
            'EMBASSY':'/vectormap/icons/EMBASSY.png',
            'FERRY TERMINAL':'/vectormap/icons/FERRY.png',
            'FIRE STATION': '/vectormap/icons/FIRE_STATION.png',
            'GOLF COURSE':'/vectormap/icons/GOLF_COURSE.png',
            'GOVERNMENT OFFICE': '/vectormap/icons/GOVERNMENT.png',
            'HARDWARE/ELECTRICAL':'/vectormap/icons/HARDWARE_STORES.png',
            'HIGHER EDUCATION':'/vectormap/icons/HIGHER_EDUCATION.png',
            'HISTORICAL MONUMENT':'/vectormap/icons/MONUMENT.png',
            'HOME ITEMS REPAIR SERVICES':'/vectormap/icons/HOME_ITEMS_REPAIR_SERVICES.png',
            'HOME SPECIALTY STORE':'/vectormap/icons/HOME_SPECIALTY_STORE.png',
            'HOSPITAL':'/vectormap/icons/HOSPITAL.png',
            'HOTEL':'/vectormap/icons/HOTEL.png',
            'ICE SKATING RINK':'/vectormap/icons/ICE_SKATING_RINK.png',
            'INDUSTRIAL ZONE':'/vectormap/icons/INDUSTRIAL_ZONE.png',
            'INTER STATE BUS TERMINAL':'/vectormap/icons/BUS_TERMINAL.png',
            'LANDMARK':'/vectormap/icons/LANDMARK.png',
            'LIBRARY':'/vectormap/icons/LIBRARY.png',
            'LIQUOR_SHOP':'/vectormap/icons/LIQUOR_SHOP.png',
            'MEDICAL SERVICES/CLINICS':'/vectormap/icons/MEDICAL_SERVICES_CLINICS.png',
            'METRO/LOCAL TRAIN STATION':'/vectormap/icons/METRO.png',
            'MOTORCYCLE DEALERSHIP':'/vectormap/icons/MOTORCYCLE_DEALERSHIP.png',
            'MOTORCYCLE MAINTENANCE':'/vectormap/icons/MOTORCYCLE_MAINTENANCE.png',
            'MOVERS & PACKERS':'/vectormap/icons/MOVERS_PACKERS.png',
            'MOVIE THEATRE':'/vectormap/icons/MOVIE_THEATRE.png',
            'MUSEUM':'/vectormap/icons/MUSEUM.png',
            'NAME OF INTERSECTION':'/vectormap/icons/INTERSECTION.png',
            'OFFICE SUPPLIES':'/vectormap/icons/OFFICE_SUPPLIES.png',
            'OTHER ACCOMMODATION (NOT HOTEL)':'/vectormap/icons/OTHER_ACCOMMODATION_NOT_HOTEL.png',
            'PARKS & RECREATION':'/vectormap/icons/PARK.png',
            'PERFORMING ARTS/AUDITORIUM':'/vectormap/icons/PERFORMING_ARTS_AUDITORIUM.png',
            'PETROL STATION':'/vectormap/icons/PETROL.png',
            'PHARMACY':'/vectormap/icons/PHARMACY.png',
            'PLACE OF WORSHIP':'/vectormap/icons/PLACE_OF_WORKSHIP.png',
            'POLICE STATION':'/vectormap/icons/POLICE_STATION.png',
            'POST OFFICE':'/vectormap/icons/POST_OFFICE.png',
            'PUBLIC PARKING':'/vectormap/icons/PUBLIC_PARKING.png',
            'PUBLIC REST ROOM':'/vectormap/icons/PUBLIC_REST_ROOM.png',
            'PUBLIC STOP':'/vectormap/icons/PUBLIC_STOP.png',
            'RACE TRACK':'/vectormap/icons/RACE.png',
            'RAILWAY STATION (REGULAR)':'/vectormap/icons/RAILWAY_2.png',
            'RECYCLING CENTER':'/vectormap/icons/RECYCLING_CENTER.png',
            'RENTAL CAR AGENCY':'/vectormap/icons/RENTAL_CAR_AGENCY.png',
            'RESIDENTIAL BUILDING (MAIN GATE)':'/vectormap/icons/BUILDING.png',
            'REST AREA':'/vectormap/icons/REST_AREA.png',
            'RESTAURANT':'/vectormap/icons/RESTAURANT.png',
            'SCHOOL':'/vectormap/icons/SCHOOL.png',
            'SHOPPING MARKET':'/vectormap/icons/SHOPPING_MARKET.png',
            'SPECIALTY/BRANDED STORE':'/vectormap/icons/SPECIALTY_BRANDED_STORE_PACKERS.png',
            'SPORTING GOODS STORE':'/vectormap/icons/SPORTING_GOODS_STORE.png',
            'SPORTS CENTRE/SPORTS COMPLEX':'/vectormap/icons/SPORTS.png',
            'TOLL BOOTH':'/vectormap/icons/TOLL_BOOTH.png',
            'TOURIST ATTRACTION':'/vectormap/icons/TOURIST_ATTRACTION.png',
            'TOURIST INFORMATION CENTRE':'/vectormap/icons/TOURIST_INFORMATION_CENTRE.png',
            // 'TRAINING CENTRE/INSTITUTE':'',
            'TRANSPORT CARGO BOOKING':'/vectormap/icons/TRANSPORT_CARGO_BOOKING.png',
            'TRUCK DEALERSHIP':'/vectormap/icons/TRUCK_DEALERSHIP.png',
            'USED VEHICLE DEALERSHIP':'/vectormap/icons/USED_VEHICLE_DEALERSHIP.png',
            'Entrance':'/vectormap/icons/Entrance.png',
            'barrier':'/vectormap/icons/barrier.png',
            'road':'/vectormap/icons/road.png',
            'default': '/vectormap/icons/LANDMARK.png'
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

    map.on('zoomend', function () {
        const currentZoom = map.getZoom();
        const targetZoom = 10; // Set your desired zoom level here

        if (currentZoom >= targetZoom && !iconsLoaded) {
            loadIcons();
            iconsLoaded = true; // Set a flag to avoid loading icons multiple times
        }
    });


//---------------- zoom level -------------------------
    //--Function to update zoom level display
    const updateZoomLevel = () => {
        const zoomLevel = map.getZoom().toFixed(1); // Get zoom level and format to 2 decimal places
        document.getElementById('zoom-level').innerText = `Zoom : ${zoomLevel}`;
    };

    //--Update zoom level display on zoom and load
    map.on('zoom', updateZoomLevel);
    map.on('load', () => {
        updateZoomLevel(); // Call to update zoom on load

        // Hide the loading message when the map has fully loaded
        document.getElementById('loadingMessage').style.display = 'none';
    });

    map.addControl(new maplibregl.NavigationControl());

//----------------------- SIDE MENU -------------------
    window.toggleSidebar = toggleSidebar;
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const button = document.querySelector('.toggle-button');
        if (sidebar.style.display === 'none' || sidebar.style.display === '') {
            sidebar.style.display = 'block';
            button.textContent = '◄'; // Change to left arrow when sidebar is open
        } else {
            sidebar.style.display = 'none';
            button.textContent = '►'; // Change to right arrow when sidebar is closed
        }
    }

//----------------------- Toggles -----------------------------

    //-----Function to toggle layer visibility
    function toggleLayer(layerIdOrSourceLayer, checkbox, isSourceLayer = false) {
        if (isSourceLayer) {
            // Toggle all layers that belong to the specified source-layer
            map.getStyle().layers.forEach((layer) => {
                if (layer['source-layer'] === layerIdOrSourceLayer) {
                    map.setLayoutProperty(layer.id, 'visibility', checkbox.checked ? 'visible' : 'none');
                }
            });
        } else {
            // Toggle visibility of a specific layer by layer ID
            map.setLayoutProperty(layerIdOrSourceLayer, 'visibility', checkbox.checked ? 'visible' : 'none');
        }
    }

     // ---Event listeners for checkboxes

    //  document.getElementById('toggle-osm-tiles').addEventListener('change', function() {
    //     toggleLayer('osm-basemap', this);
    // });

     document.getElementById('toggle-coastal').addEventListener('change', function() {
        toggleLayer('COASTAL_LAND', this,true);
    });

    document.getElementById('toggle-admin').addEventListener('change', function() {
        toggleLayer('COUNTRY_BOUNDARY_V1_1', this,true);
        toggleLayer('country_labels', this);
        toggleLayer('STATE_BOUNDARY', this);
        toggleLayer('state_labels', this);
        toggleLayer('DISTRICT_BOUNDARY', this);
        toggleLayer('dist_labels', this);
        toggleLayer('SUBDIST', this);
        toggleLayer('sub_dist_labels', this);
        toggleLayer('LOCALITY', this);
        toggleLayer('locality_labels', this);
    });

    document.getElementById('toggle-akshara').addEventListener('change', function() {
        toggleLayer('akshara', this);
        toggleLayer('akshara_labels', this);
    });

    document.getElementById('toggle-bindu').addEventListener('change', function() {
        toggleLayer('DEDUCE_BINDU_LITE_V1_6', this,true);
    });

    document.getElementById('toggle-environ').addEventListener('change', function() {
        toggleLayer('amenity', this);
        toggleLayer('access_points', this);
        toggleLayer('bfp', this);
        toggleLayer('gated_commu', this);
        toggleLayer('gated_lables', this);
        toggleLayer('GATES_LITE_V1_14', this,true);
        toggleLayer('INTERNAL_ROADS_LITE_V1_14', this,true);
        toggleLayer('road_entry', this);
        toggleLayer('UNITS_LITE_V1_13', this,true);
    });
    
    document.getElementById('toggle-nilaya').addEventListener('change', function() {
        toggleLayer('nilaya', this);
    });

    document.getElementById('toggle-nivasa').addEventListener('change', function() {
        toggleLayer('nivasa', this);
    });

   document.getElementById('toggle-roads').addEventListener('change', function() {
    toggleLayer('DEDUCE_INDIA_ROADS_V1_1', this, true);
    });

    // ---Ensure initial state matches checkboxes
    // document.getElementById('toggle-osm-tiles').checked = true;
    document.getElementById('toggle-coastal').checked = true;
    document.getElementById('toggle-admin').checked = true;
    document.getElementById('toggle-akshara').checked = true;
    document.getElementById('toggle-bindu').checked = true;
    document.getElementById('toggle-environ').checked = true;
    document.getElementById('toggle-nilaya').checked = true;
    document.getElementById('toggle-nivasa').checked = true;
    document.getElementById('toggle-roads').checked = true;


// --------------------Error Message----------------------------------------
    map.on('error', function(e) {
        console.error('Map error:', e.error);
    });

    // map.on('style.load', function() {
    //     console.log('Style loaded successfully.');
    //     var layers = map.getStyle().layers;
    //     console.log("Layers:", layers);
    //     var sources = map.getStyle().sources;
    //     console.log("Sources:", sources);
    // });



//--------------------------POPUP------------------------
    // var popup = new maplibregl.Popup({
    //     closeButton: false,
    //     closeOnClick: false
    // });

    // map.on('mousemove', 'akshara', function(e) {
    //     map.getCanvas().style.cursor = 'pointer';

    //     var feature = e.features[0];
    //     var coordinates = e.lngLat;

    //     popup.setLngLat(coordinates)
    //         .setHTML('<h3>Feature Details</h3><p>NAME : ' + feature.properties.name + '</p><p>Type : ' + feature.properties.type + '</p><p>sub_type :' + feature.properties.sub_type + '</p>')
    //         .addTo(map);
    // });

    // map.on('mouseleave', 'akshara', function() {
    //     map.getCanvas().style.cursor = '';
    //     popup.remove();
    // });

    // var popup = new maplibregl.Popup({
    //     closeButton: false,
    //     closeOnClick: false
    // });

    // function showPopup(e) {
    //     map.getCanvas().style.cursor = 'pointer';

    //     var feature = e.features[0];
    //     var coordinates = e.lngLat;

    //     popup.setLngLat(coordinates)
    //         .setHTML('<h3>Feature Details</h3><p>NAME : ' + feature.properties.name + '</p><p>Type : ' + feature.properties.type + '</p><p>sub_type :' + feature.properties.sub_type + '</p>')
    //         .addTo(map);
    // }

    // function hidePopup() {
    //     map.getCanvas().style.cursor = '';
    //     popup.remove();
    // }

    // var layers = ['akshara', 'nilaya']; // Add more layer IDs here

    // layers.forEach(function(layer) {
    //     map.on('mousemove', layer, showPopup);
    //     map.on('mouseleave', layer, hidePopup);
    // });
    
        return map;
    }
