import React, { useEffect, useState } from 'react';
import { database, ref, onValue } from '../firebase';

const DataCard = ({ city }) => {
  const [pm25, setPm25] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    const cityKey = normalizeCityName(city);
    const cityRef = ref(database, cityKey);

    setLoading(true);
    onValue(
      cityRef,
      (snapshot) => {
        const value = snapshot.val();
        setPm25(typeof value === 'number' ? value : null);
        setLoading(false);
      },
      { onlyOnce: true }
    );
  }, [city]);

  return (
    <div
      style={{
        padding: '16px',
        width: '220px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h3 style={{ marginBottom: '8px', fontSize: '18px', color: '#333' }}>{city}</h3>
      {loading ? (
        <p style={{ color: '#888' }}>Đang tải...</p>
      ) : (
        <p
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: getPm25Color(pm25),
          }}
        >
          PM2.5: {pm25}
        </p>
      )}
    </div>
  );
};

function normalizeCityName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function getPm25Color(pm) {
  if (pm <= 50) return '#4CAF50';
  if (pm <= 100) return '#FFC107';
  if (pm <= 150) return '#FF9800';
  if (pm <= 200) return '#F44336';
  if (pm <= 300) return '#9C27B0';
  return '#795548';
}

export default DataCard;
