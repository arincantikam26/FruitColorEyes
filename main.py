from fastapi import FastAPI, Request, Query, Form
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import cv2
import time
import numpy as np

app = FastAPI()

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")




class CameraDetect:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        self.running = True
        self.frame = None
        self.low = np.array([35, 137, 161])
        self.up = np.array([255, 255, 255])
    
    def get_frame(self):
        if not self.running:
            return None
        ret, frame = self.cap.read()
        if not ret:
            return None
        self.frame = frame
        return frame
    
    def convert_frame_to_bytes(self):
        if self.frame is None:
            return None
        ret, jpeg = cv2.imencode('.jpg', self.frame)
        if not ret:
            return None
        return jpeg.tobytes()
    
    def mask_frame(self):
        if self.frame is None:
            return None
        hsv = cv2.cvtColor(self.frame, cv2.COLOR_BGR2HSV)
        low = np.array([35, 137, 161])
        up = np.array([255, 255, 255])
        mask = cv2.inRange(hsv, self.low, self.up)
        ret, jpeg = cv2.imencode('.jpg', mask)
        if not ret:
            return None
        return jpeg.tobytes()
    
    def stop(self):
        self.running = False
        self.cap.release()
    
    def start(self):
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            print("Error: Could not open video device")
        self.running = True


cam = CameraDetect()

@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/mask_feed")
def mask_feed():
    return StreamingResponse(generate_masked_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.post("/update_thresholds")
async def update_thresholds(low_h: int = Form(...), low_s: int = Form(...), low_v: int = Form(...), up_h: int = Form(...), up_s: int = Form(...), up_v: int = Form(...)):
    cam.low = np.array([low_h, low_s, low_v])
    cam.up = np.array([up_h, up_s, up_v])
    return {"message": "Thresholds updated"}


@app.post("/start_camera")
def start_camera():
    cam.start()
    return {"message": "Camera started"}

@app.post("/stop_camera")
def stop_camera():
    cam.stop()
    return {"message": "Camera stopped"}

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