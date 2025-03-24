import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

const provinces = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Nha Trang"];

// Giả lập dữ liệu nồng độ bụi mịn theo từng giây
const generateLiveData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    time: `${i}s`,
    pm25: Math.floor(Math.random() * 100) + 20, // Giá trị ngẫu nhiên từ 20 - 120
  }));
};

// Dữ liệu nồng độ bụi theo tuần
const weeklyData = [
  { day: "T2", pm25: 75 },
  { day: "T3", pm25: 68 },
  { day: "T4", pm25: 80 },
  { day: "T5", pm25: 72 },
  { day: "T6", pm25: 85 },
  { day: "T7", pm25: 90 },
  { day: "CN", pm25: 95 },
];

const RightSection = () => {
  const [selectedProvince, setSelectedProvince] = useState(provinces[0]);
  const [liveData, setLiveData] = useState(generateLiveData());

  // Cập nhật dữ liệu bụi mịn mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prevData) => [
        ...prevData.slice(1), // Loại bỏ điểm đầu tiên để giữ độ dài cố định
        { time: `${prevData.length}s`, pm25: Math.floor(Math.random() * 100) + 20 },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">

      {/* Select box chọn tỉnh thành */}
      <div className="mb-4 text-center">
        <label className="fw-bold me-2">Chọn tỉnh thành:</label>
        <select className="form-select w-auto d-inline-block" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
          {provinces.map((province, index) => (
            <option key={index} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* Biểu đồ đường - Bụi mịn theo giây */}
      <div className="mb-4 bg-light p-3 rounded shadow">
        <h4 className="text-center text-secondary">Nồng độ bụi theo từng giây</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={liveData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pm25" stroke="#ff5733" strokeWidth={2} name="PM2.5 (µg/m³)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ cột - Nồng độ bụi mịn trong tuần */}
      <div className="bg-light p-3 rounded shadow">
        <h4 className="text-center text-secondary">Nồng độ bụi trong tuần</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pm25" fill="#007bff" name="PM2.5 (µg/m³)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RightSection;
