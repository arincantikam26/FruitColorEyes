from fastapi import FastAPI,  Form, Request
from fastapi.middleware.cors import CORSMiddleware
from utils import CameraDetect
from fastapi.responses import HTMLResponse, StreamingResponse
import numpy as np



app = FastAPI()

origins = [
    'http://localhost:5173',
    'http://localhost:3000',
]

app.add_middleware (
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

cam = CameraDetect()


@app.post("/start_camera")
def start_camera():
    cam.start()
    return {"message": "Camera started"}

@app.post("/stop_camera")
def stop_camera():
    cam.stop()
    return {"message": "Camera stopped"}

@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/mask_feed")
async def mask_feed():
    return StreamingResponse(generate_masked_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.post("/update_thresholds")
async def update_thresholds(low_h: int = Form(...), low_s: int = Form(...), low_v: int = Form(...), up_h: int = Form(...), up_s: int = Form(...), up_v: int = Form(...)):
    cam.low = np.array([low_h, low_s, low_v])
    cam.up = np.array([up_h, up_s, up_v])
    return {"message": "Thresholds updated"}

def generate_frames():
    while cam.running:
        frame = cam.get_frame()
        if frame is None:
            continue
        frame_bytes = cam.convert_frame_to_bytes()
        if frame_bytes is None:
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')


def generate_masked_frames():
    while cam.running:
        frame = cam.get_frame()
        if frame is None:
            continue
        mask_bytes = cam.mask_frame()
        if mask_bytes is None:
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + mask_bytes + b'\r\n\r\n')