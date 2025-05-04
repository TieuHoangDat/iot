import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DataCard from '../components/DataCard.jsx'; // Dùng đường dẫn tương đối
import ReactDOM from 'react-dom';

// Toạ độ cho các thành phố
const cities = [
  { name: 'Hà Nội', position: [21.0285, 105.8542] },
  { name: 'Hồ Chí Minh', position: [10.7626, 106.6602] },
  { name: 'Đà Nẵng', position: [16.0471, 108.2062] },
  { name: 'Cần Thơ', position: [10.0452, 105.7469] },
  { name: 'Hải Phòng', position: [20.8449, 106.6881] },
  { name: 'Nha Trang', position: [12.2388, 109.1967] }
];

const Map = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([16.0471, 108.2068], 6); // Trung tâm Việt Nam

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      cities.forEach(city => {
        const marker = L.marker(city.position).addTo(mapInstance.current);
      
        const popupContainer = document.createElement('div');
      
        // Dùng React để render DataCard vào popupContainer
        const root = ReactDOM.createRoot(popupContainer);
        root.render(<DataCard city={city.name} />);
      
        marker.bindPopup(popupContainer);
      });
      
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const mapStyle = {
    width: '100%',
    height: '600px',
    margin: '20px 0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div>
      <h2>Bản đồ thiết bị</h2>
      <div ref={mapRef} style={mapStyle}></div>

      {/* Hiển thị DataCard khi có thành phố được chọn */}
      {selectedCity && (
        <div style={{ marginTop: '20px' }}>
          <DataCard city={selectedCity} />
        </div>
      )}
    </div>
  );
};

export default Map;
