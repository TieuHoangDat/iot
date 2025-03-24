import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const airQualityData = [
  { city: "Hà Nội", pm25: 75 },
  { city: "Hồ Chí Minh", pm25: 65 },
  { city: "Đà Nẵng", pm25: 50 },
  { city: "Cần Thơ", pm25: 45 },
  { city: "Hải Phòng", pm25: 60 },
  { city: "Nha Trang", pm25: 40 },
];

const LeftSection = () => {
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
                <p className={`card-text fw-bold ${data.pm25 > 50 ? "text-danger" : "text-success"}`}>
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
                // angle={-30}  // Xoay chữ để tránh trùng
                textAnchor="end" 
                interval={0} // Hiển thị tất cả tên tỉnh
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pm25" fill="#007bff" name="" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
