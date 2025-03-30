import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  
  // Example position (Hanoi coordinates)
  const position = [21.0285, 105.8542];
  
  // You can add your device positions here
  const devices = [
    { id: 1, name: "Device 1", position: [21.0285, 105.8542], status: "active" },
    { id: 2, name: "Device 2", position: [21.0278, 105.8605], status: "inactive" }
  ];

  useEffect(() => {
    // Fix for the default marker icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
    
    // Initialize map if it doesn't exist
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(position, 13);
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
      
      // Add markers for devices
      devices.forEach(device => {
        const marker = L.marker(device.position).addTo(mapInstance.current);
        marker.bindPopup(`
          <div>
            <h4>${device.name}</h4>
            <p>Trạng thái: ${device.status === "active" ? "Hoạt động" : "Không hoạt động"}</p>
            <p>Vị trí: ${device.position[0]}, ${device.position[1]}</p>
          </div>
        `);
      });
    }
    
    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Map styles
  const mapStyle = {
    width: '100%',
    height: '600px',
    margin: '20px 0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div className="row">
      <h2>Bản đồ thiết bị</h2>
      <p>Xem vị trí của tất cả thiết bị IoT được đăng ký trong hệ thống.</p>
      <div ref={mapRef} style={mapStyle}></div>
    </div>
  );
};

export default Map;