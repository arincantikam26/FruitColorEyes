import cv2
import numpy as np

def nothing(x):
    pass

# Membuat window kontrol untuk warna
cv2.namedWindow('CONTROL WARNA')
cv2.createTrackbar('HMIN', 'CONTROL WARNA', 30, 255, nothing)  # Hue minimum
cv2.createTrackbar('SMIN', 'CONTROL WARNA', 40, 255, nothing)  # Saturation minimum
cv2.createTrackbar('VMIN', 'CONTROL WARNA', 80, 255, nothing)  # Value minimum
cv2.createTrackbar('HMAX', 'CONTROL WARNA', 85, 255, nothing)  # Hue maximum
cv2.createTrackbar('SMAX', 'CONTROL WARNA', 150, 255, nothing) # Saturation maximum
cv2.createTrackbar('VMAX', 'CONTROL WARNA', 200, 255, nothing) # Value maximum

# Membuat window kontrol untuk mask
cv2.namedWindow('CONTROL MASK')
cv2.createTrackbar('DILASII', 'CONTROL MASK', 1, 20, nothing)
cv2.createTrackbar('BLUR', 'CONTROL MASK', 5, 20, nothing)
cv2.createTrackbar('EROSI', 'CONTROL MASK', 1, 20, nothing)

# Membuka kamera
cap = cv2.VideoCapture(0)

while True:
    # Membaca nilai trackbar untuk warna
    hmin = cv2.getTrackbarPos('HMIN', 'CONTROL WARNA')
    smin = cv2.getTrackbarPos('SMIN', 'CONTROL WARNA')
    vmin = cv2.getTrackbarPos('VMIN', 'CONTROL WARNA')
    hmax = cv2.getTrackbarPos('HMAX', 'CONTROL WARNA')
    smax = cv2.getTrackbarPos('SMAX', 'CONTROL WARNA')
    vmax = cv2.getTrackbarPos('VMAX', 'CONTROL WARNA')

    # Membaca nilai trackbar untuk mask
    dilate_size = cv2.getTrackbarPos('DILASII', 'CONTROL MASK')
    blur_size = cv2.getTrackbarPos('BLUR', 'CONTROL MASK')
    erode_size = cv2.getTrackbarPos('EROSI', 'CONTROL MASK')

    # Memastikan blur_size adalah ganjil dan lebih besar dari 0
    if blur_size % 2 == 0:
        blur_size += 1

    # Membuat batas bawah dan atas untuk warna
    lower_color = np.array([hmin, smin, vmin])
    upper_color = np.array([hmax, smax, vmax])

    # Membaca frame dari kamera
    ret, frame = cap.read()
    if not ret:
        break

    # Mengubah frame ke warna HSV dan mengaburkan (blur)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    blurred = cv2.GaussianBlur(hsv, (blur_size, blur_size), 0)

    # Membuat mask berdasarkan batas warna
    mask = cv2.inRange(hsv, lower_color, upper_color)

    # Menggunakan dilasi dan erosi untuk memperbaiki mask
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=dilate_size)
    mask = cv2.erode(mask, kernel, iterations=erode_size)

    # Menemukan kontur
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Menggambar bounding box dan teks
    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 500:  # Hanya gambar kotak untuk area yang cukup besar
            x, y, w, h = cv2.boundingRect(contour)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, f'Color', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            cv2.putText(frame, f'Area: {area}', (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    # Menampilkan hasil
    cv2.imshow('Video', frame)
    cv2.imshow('Mask', mask)

    # Keluar jika tombol 'q' ditekan
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Melepaskan sumber daya
cap.release()
cv2.destroyAllWindows()