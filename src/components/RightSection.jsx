import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { database } from "../firebase"; // Import Firebase đã cấu hình

// Mapping key Firebase → tên hiển thị
const provinces = {
  "Hà Nội": "ha_noi",
  "Hồ Chí Minh": "ho_chi_minh",
  "Đà Nẵng": "da_nang",
  "Cần Thơ": "can_tho",
  "Hải Phòng": "hai_phong",
  "Nha Trang": "nha_trang",
};

const RightSection = () => {
  const [selectedProvince, setSelectedProvince] = useState("Hà Nội");
  const [liveData, setLiveData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const dbRef = ref(database, "/");
    let currentPM25 = 50;

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const selectedKey = provinces[selectedProvince]; // chuyển sang key Firebase
      if (data && data[selectedKey]) {
        currentPM25 = data[selectedKey];
      }
    });

    const interval = setInterval(() => {
      setLiveData((prevData) => {
        const newData = [
          ...prevData.slice(-9),
          { time: prevData.length, pm25: currentPM25 },
        ];

        return newData.map((item, index) => ({
          ...item,
          time: `${index - 9}s`,
        }));
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [selectedProvince]);

  useEffect(() => {
    const dbRef = ref(database, "measurementsByDate");

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const selectedKey = provinces[selectedProvince]; // chuyển sang key Firebase

      const transformedData = Object.entries(data)
        .slice(-7) // Lấy 7 ngày gần nhất
        .map(([date, values]) => ({
          day: date,
          pm25: values[selectedKey] || 0,
        }));

      setWeeklyData(transformedData);
    });
  }, [selectedProvince]);

  return (
    <div className="container">
      {/* Chọn tỉnh thành */}
      <div className="mb-4 text-center">
        <label className="fw-bold me-2">Chọn tỉnh thành:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          {Object.keys(provinces).map((province, index) => (
            <option key={index} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* Biểu đồ đường - Bụi mịn theo giây */}
      <div className="mb-4 bg-light p-3 rounded shadow">
        <h4 className="text-center text-secondary">Nồng độ bụi theo từng giây</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={liveData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pm25"
              stroke="#ff5733"
              strokeWidth={2}
              name="PM2.5 (µg/m³)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ cột - Bụi mịn 7 ngày gần nhất */}
      <div className="bg-light p-3 rounded shadow">
        <h4 className="text-center text-secondary">Nồng độ bụi 7 ngày gần nhất</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={weeklyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="pm25"
              fill="#007bff"
              name="PM2.5 (µg/m³)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RightSection;
