import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { database } from "../firebase"; // Import Firebase đã cấu hình

const LeftSection = () => {
  const [airQualityData, setAirQualityData] = useState([]);

  useEffect(() => {
    const dbRef = ref(database, "/"); // Đọc toàn bộ dữ liệu từ gốc database
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Danh sách key (Firebase) và tên hiển thị (giao diện)
        const selectedCities = [
          { key: "can_tho", label: "Cần Thơ" },
          { key: "da_nang", label: "Đà Nẵng" },
          { key: "ha_noi", label: "Hà Nội" },
          { key: "hai_phong", label: "Hải Phòng" },
          { key: "ho_chi_minh", label: "Hồ Chí Minh" },
          { key: "nha_trang", label: "Nha Trang" },
        ];

        // Chuyển đổi dữ liệu từ Firebase sang định dạng cần hiển thị
        const formattedData = selectedCities.map((city) => ({
          city: city.label,
          pm25: data[city.key] || 0, // Nếu không có dữ liệu, gán 0
        }));

        setAirQualityData(formattedData);
      }
    });
  }, []);

  return (
    <div className="container p-4">
      <h2 className="text-primary text-center mb-4">Nồng độ bụi mịn PM2.5</h2>

      {/* Danh sách thông tin nồng độ bụi mịn */}
      <div className="row">
        {airQualityData.map((data, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">{data.city}</h5>
                <p className={`card-text fw-bold ${data.pm25 > 100 ? "text-danger" : "text-success"}`}>
                  {data.pm25} µg/m³
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ bụi mịn */}
      <div className="mt-4">
        <h3 className="text-center text-secondary">Biểu đồ bụi mịn PM2.5</h3>
        <div className="bg-light p-3 rounded shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={airQualityData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <XAxis
                dataKey="city"
                tick={{ fontSize: 10 }}
                tickMargin={10}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pm25" fill="#007bff" name="PM2.5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
