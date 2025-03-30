from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI()

# CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to match your frontend's domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static files directory for serving tiles and other static content
app.mount("/vectormap", StaticFiles(directory="/opt/vectortilemap/vectormap"), name="vectormap")

# Path to the directory containing HTML and JavaScript files
templates = Jinja2Templates(directory="/opt/vectortilemap/vectormap")

@app.get("/vectormap")
async def read_root(request: Request):
    # Return the main HTML file
    return templates.TemplateResponse("map.html", {"request": request})

# Catch-all route to serve all other files
@app.get("/{file_path:path}")
async def serve_file(file_path: str):
    file_path = Path("/opt/vectortilemap/vectormap") / file_path
    if file_path.exists() and file_path.name != "map.html":
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9092)
