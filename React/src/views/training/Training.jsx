import React, { useState, useEffect } from "react";
import NoCam from "../../assets/img/iconnocam.png";
import "./Training.css";
import RangeSlider from "../../component/slider/RangeSlider";
import Button from "../../component/button/Button";
import HSVColorPicker from "./HSVColorPicker";
import ApiClient, { API_BASE_URL } from "../../helpers/Api";

const Training = () => {
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);
  console.log(isVideoAvailable)

  const handleError = () => {
    setIsVideoAvailable(false);
  };

  const startCamera = async () => {
    try {
      await ApiClient.post('/start_camera');
      setIsVideoAvailable(true); // Coba memulai kamera lagi
      console.log('Camera started');
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const stopCamera = async () => {
    try {
      await ApiClient.post('/stop_camera');
      setIsVideoAvailable(false);
      console.log('Camera stopped');
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };


  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Train Data</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="original">
            <img
              src={isVideoAvailable ? `${API_BASE_URL}/video_feed` :  NoCam }
              alt="Original Frame"
              className="frame"
            />
          </div>
          <div className="original">
            <img
              src={isVideoAvailable ? `${API_BASE_URL}/mask_feed` :  NoCam }
              alt="Mask Frame"
              className="frame"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="btnTraining">
            <Button primary onClick={startCamera}>Start Training</Button>
            <Button red onClick={stopCamera}>Stop Training</Button>
          </div>

          <div className="sliderPlace">
            <HSVColorPicker camStatus={isVideoAvailable}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
