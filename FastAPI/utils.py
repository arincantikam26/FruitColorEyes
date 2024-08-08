import numpy as np
import cv2


class CameraDetect:
    def __init__(self):
        self.cap = None
        self.running = False
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
