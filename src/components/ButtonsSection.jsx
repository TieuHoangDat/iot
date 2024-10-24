import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { database, ref, onValue, set } from '../firebase'; // Import Firebase setup

const ButtonsSection = () => {
  const [lightIntensity, setLightIntensity] = useState(100);
  const [temperature, setTemperature] = useState(32);
  const [activeLight, setActiveLight] = useState(0);
  const [activeTem, setActiveTem] = useState(0);
  const [rem, setRem] = useState('OFF');
  const [prevRem, setPrevRem] = useState(null);

  const updateFirebase = (path, value) => {
    const dbRef = ref(database, path);
    set(dbRef, value);
  };

  const logRemAction = (action) => {
    // Tạo reference tới log trước đó
    const remActionsRef = ref(database, 'rem_actions');
  
    // Thêm delay 1 giây trước khi kiểm tra log cuối cùng
    setTimeout(() => {
      // Lấy log cuối cùng trước khi thêm log mới
      onValue(remActionsRef, (snapshot) => {
        const logs = snapshot.val();
        const logsArray = logs ? Object.values(logs) : [];
        const lastLog = logsArray.length > 0 ? logsArray[logsArray.length - 1] : null;
  
        // Nếu log cuối cùng khác với hành động mới, thì thêm log mới
        if (!lastLog || lastLog.action !== (action === 'ON' ? 'Mở rèm' : 'Đóng rèm')) {
          const newActionRef = ref(database, `rem_actions/${Date.now()}`);
          set(newActionRef, {
            action: action === 'ON' ? 'Mở rèm' : 'Đóng rèm',
            timestamp: new Date().toLocaleString(),
          });
        }
      }, { onlyOnce: true });
    }, 1000); // Delay 1 giây (1000ms)
  };
  

  useEffect(() => {
    const lightRef = ref(database, 'LIGHT');
    const activeLightRef = ref(database, 'ACTIVE_LIGHT');
    const temperatureRef = ref(database, 'TEMPERATURE');
    const activeTemRef = ref(database, 'ACTIVE_TEMPERATURE');
    const ledRef = ref(database, 'LED');

    const unsubscribeLight = onValue(lightRef, (snapshot) => {
      const light = snapshot.val();
      if (light !== null) {
        setLightIntensity(light);
      }
    });

    const unsubscribeActiveLight = onValue(activeLightRef, (snapshot) => {
      const active = snapshot.val();
      if (active !== null) {
        setActiveLight(active);
      }
    });

    const unsubscribeTemperature = onValue(temperatureRef, (snapshot) => {
      const temp = snapshot.val();
      if (temp !== null) {
        setTemperature(temp);
      }
    });

    const unsubscribeActiveTem = onValue(activeTemRef, (snapshot) => {
      const active = snapshot.val();
      if (active !== null) {
        setActiveTem(active);
      }
    });

    const unsubscribeLED = onValue(ledRef, (snapshot) => {
      const ledStatus = snapshot.val();
      if (ledStatus !== null) {
        setRem(ledStatus); 

        // Chỉ log hành động khi trạng thái rem thực sự thay đổi
        if (prevRem !== null && prevRem !== ledStatus) {
          logRemAction(ledStatus);
        }
        
        setPrevRem(ledStatus); // Cập nhật trạng thái trước đó
      }
    });

    return () => {
      unsubscribeLight();
      unsubscribeActiveLight();
      unsubscribeTemperature();
      unsubscribeActiveTem();
      unsubscribeLED();
    };
  }, [prevRem]);

  return (
    <div className="mt-3">
      <h4>Thiết bị</h4>
      <div className="row mb-4">
        <div className="col-md-6">
          <Card>
            <Card.Body className="text-center">
              <Form.Check
                type="switch"
                id="door"
                label="Đóng mở cửa ra vào"
                className="mb-2"
              />
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <Card>
            <Card.Body className="text-center">
              <Form.Check
                type="switch"
                id="rem"
                label="Đóng mở rèm cửa"
                checked={rem === 'ON'}
                onChange={(e) => {
                  const newRemState = e.target.checked ? 'ON' : 'OFF';
                  setRem(newRemState);
                  updateFirebase('LED', newRemState);
                  // logRemAction(newRemState);
                }}
                className="mb-2"
              />
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Automation Section */}
      <h4>Tự động</h4>
      <div className="row mb-4">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <Form.Check
                type="switch"
                id="activeLight"
                label="Tự động đóng mở rèm bằng ánh sáng"
                checked={activeLight === 1}
                onChange={(e) => {
                  const newActiveLight = e.target.checked ? 1 : 0;
                  setActiveLight(newActiveLight);
                  updateFirebase('ACTIVE_LIGHT', newActiveLight);
                }}
                className="mb-2"
              />
              <Form.Range
                value={lightIntensity}
                onChange={(e) => {
                  const newLightIntensity = e.target.value;
                  setLightIntensity(newLightIntensity);
                  updateFirebase('LIGHT', newLightIntensity);
                }}
                min={0}
                max={100}
              />
              <div className="text-center mt-2">
                <span>Cường độ ánh sáng: {lightIntensity}%</span>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <Form.Check
                type="switch"
                id="activeTem"
                label="Tự động đóng mở rèm bằng nhiệt độ"
                checked={activeTem === 1}
                onChange={(e) => {
                  const newActiveTem = e.target.checked ? 1 : 0;
                  setActiveTem(newActiveTem);
                  updateFirebase('ACTIVE_TEMPERATURE', newActiveTem);
                }}
                className="mb-2"
              />
              <Form.Range
                value={temperature}
                onChange={(e) => {
                  const newTemperature = e.target.value;
                  setTemperature(newTemperature);
                  updateFirebase('TEMPERATURE', newTemperature);
                }}
                min={16}
                max={40}
              />
              <div className="text-center mt-2">
                <span>Nhiệt độ: {temperature}°C</span>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ButtonsSection;
