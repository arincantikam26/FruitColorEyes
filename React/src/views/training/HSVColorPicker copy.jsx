import React, { useState } from "react";
import RangeSlider from "../../component/slider/RangeSlider";
import ApiClient from "../../helpers/Api";

const HSVColorPicker = ({camStatus}) => {
  const [values, setValues] = useState({
    low_h: 50,
    low_s: 50,
    low_v: 50,
    up_h: 70,
    up_s: 100,
    up_v: 100,
  });

  const sliders = [
    {
      label: "H Low",
      name: "low_h",
      min: 0,
      max: 360,
      value: values.low_h,
      style: {
        background:
          "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
      },
    },
    {
      label: "S Low",
      name: "low_s",
      min: 0,
      max: 100,
      value: values.low_s,
      style: {
        background: `linear-gradient(to right, gray, hsl(${values.low_h}, 100%, 50%))`,
      },
    },
    {
      label: "V Low",
      name: "low_v",
      min: 0,
      max: 100,
      value: values.low_v,
      style: {
        background: `linear-gradient(to right, black, hsl(${values.low_h}, ${values.low_s}%, 50%))`,
      },
    },
    {
      label: "H Up",
      name: "up_h",
      min: 0,
      max: 360,
      value: values.up_h,
      style: {
        background:
          "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
      },
    },
    {
      label: "S Up",
      name: "up_s",
      min: 0,
      max: 100,
      value: values.up_s,
      style: {
        background: `linear-gradient(to right, gray, hsl(${values.up_h}, 100%, 50%))`,
      },
    },
    {
      label: "V Up",
      name: "up_v",
      min: 0,
      max: 100,
      value: values.up_v,
      style: {
        background: `linear-gradient(to right, black, hsl(${values.up_h}, ${values.up_s}%, 50%))`,
      },
    },
  ];


  const handleChange = async (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: parseInt(value, 10) };
    setValues(newValues);

    const lower_bound_opencv = convertToOpenCV(newValues.low_h, newValues.low_s, newValues.low_v);
    const upper_bound_opencv = convertToOpenCV(newValues.up_h, newValues.up_s, newValues.up_v);

    try {
        const formData = new FormData();
        formData.append('low_h', lower_bound_opencv[0]);
        formData.append('low_s', lower_bound_opencv[1]);
        formData.append('low_v', lower_bound_opencv[2]);
        formData.append('up_h', upper_bound_opencv[0]);
        formData.append('up_s', upper_bound_opencv[1]);
        formData.append('up_v', upper_bound_opencv[2]);
  
        await ApiClient.post('/update_thresholds', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Thresholds updated');
      } catch (error) {
        console.error('Error updating thresholds:', error);
      }


  };


  const convertToOpenCV = (h, s, v) => {
    const h_opencv = Math.round(h / 2);
    const s_opencv = Math.round(s * 2.55);
    const v_opencv = Math.round(v * 2.55);
    return [h_opencv, s_opencv, v_opencv];
  };

  const getBackgroundColor = () => {
    const hsvToRgb = (h, s, v) => {
      s /= 100;
      v /= 100;
      let k = (n) => (n + h / 60) % 6;
      let f = (n) => v * (1 - s * Math.max(Math.min(k(n), 4 - k(n), 1), 0));
      return [
        Math.round(f(5) * 255),
        Math.round(f(3) * 255),
        Math.round(f(1) * 255),
      ];
    };

    const [r, g, b] = hsvToRgb(values.low_h, values.low_s, values.low_v);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const lower_bound_opencv = convertToOpenCV(
    values.low_h,
    values.low_s,
    values.low_v
  );
  const upper_bound_opencv = convertToOpenCV(
    values.up_h,
    values.up_s,
    values.up_v
  );

  return (
    <div>
      <h2>HSV Color Picker</h2>
      <div
        className="color-display"
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <p>Color Display</p>
      </div>
      <div className="slider-group">
        {sliders.map((slider) => (
          <RangeSlider
            key={slider.name}
            label={slider.label}
            name={slider.name}
            min={slider.min}
            max={slider.max}
            value={slider.value}
            onChange={handleChange}
            style={slider.style}
            disabled={!camStatus}
          />
        ))}
      </div>
      <div className="opencv-values">
        <p>Lower Bound (OpenCV): {lower_bound_opencv.join(", ")}</p>
        <p>Upper Bound (OpenCV): {upper_bound_opencv.join(", ")}</p>
      </div>
    </div>
  );
};

export default HSVColorPicker;
