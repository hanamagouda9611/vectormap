# 🗺️ Vector Map App using Node.js, FastAPI & Tippecanoe

This is a self-contained vector map application that uses **Node.js** to serve both frontend and backend, integrates with **FastAPI** (via a subprocess or API call if applicable), and uses **Tippecanoe** to generate vector tiles from GeoJSON data.

## 🚀 Features

- Serves vector tiles (`.pbf`) generated using **Tippecanoe**
- Simple interactive map using **Mapbox GL JS**
- Entire server handled via a single `server.js` file
- Optional integration with FastAPI for geospatial APIs or metadata
- Static hosting of HTML, JS, and CSS files

## 🧰 Tech Stack

- Node.js (main server)
- Tippecanoe (CLI tool for vector tile generation)
- Mapbox GL JS (map rendering)
- FastAPI (optional — for external data APIs)
- GeoJSON as source data


###  1. Clone the Repo

```bash
git clone https://github.com/hanamagouda9611/vectormap.git
cd vectormap
```

###  2. Install Node.js Dependencies

```bash
npm install
```

### 3. Run the Server

```bash
node server.js
```

**🗺️ Usage
Open your browser and visit http://localhost:3000 to view the map.

The map will load vector tiles dynamically as you pan and zoom.


