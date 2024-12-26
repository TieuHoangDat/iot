import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { database, ref, onValue, set } from '../firebase'; // Import Firebase setup
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Thêm icon con mắt

const ButtonsSection = () => {
  const [rem, setRem] = useState('OFF');
  const [prevRem, setPrevRem] = useState(null);
  const [password, setPassword] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tmpPassword, setTmpPassword] = useState('');
  const [time, setTime] = useState('');
  const [newTime, setNewTime] = useState(''); // Thời gian mới khi người dùng chỉnh sửa

  const updateFirebase = (path, value) => {
    const dbRef = ref(database, path);
    set(dbRef, value);
  };

  const logRemAction = (action) => {
    const remActionsRef = ref(database, 'rem_actions');
    setTimeout(() => {
      onValue(remActionsRef, (snapshot) => {
        const logs = snapshot.val();
        const logsArray = logs ? Object.values(logs) : [];
        const lastLog = logsArray.length > 0 ? logsArray[logsArray.length - 1] : null;

        if (!lastLog || lastLog.action !== (action === 'ON' ? 'Mở cửa' : 'Khoá cửa')) {
          const newActionRef = ref(database, `rem_actions/${Date.now()}`);
          set(newActionRef, {
            action: action === 'ON' ? 'Mở cửa' : 'Khoá cửa',
            timestamp: new Date().toLocaleString(),
          });
        }
      }, { onlyOnce: true });
    }, 1000);
  };

  useEffect(() => {
    const ledRef = ref(database, 'LED');
    const passwordRef = ref(database, 'PASSWORD');
    const tmpPasswordRef = ref(database, 'TMP_PASSWORD');
    const timeRef = ref(database, 'TIME');

    const unsubscribeLED = onValue(ledRef, (snapshot) => {
      const ledStatus = snapshot.val();
      if (ledStatus !== null) {
        setRem(ledStatus);

        if (prevRem !== null && prevRem !== ledStatus) {
          logRemAction(ledStatus);
        }

        setPrevRem(ledStatus);
      }
    });

    const unsubscribePassword = onValue(passwordRef, (snapshot) => {
      const currentPassword = snapshot.val();
      if (currentPassword !== null) {
        setPassword(currentPassword);
        setEditedPassword(currentPassword);
      }
    });

    const unsubscribeTmpPassword = onValue(tmpPasswordRef, (snapshot) => {
      const currentTmpPassword = snapshot.val();
      if (currentTmpPassword !== null) {
        setTmpPassword(currentTmpPassword);
      }
    });

    const unsubscribeTime = onValue(timeRef, (snapshot) => {
      const currentTime = snapshot.val();
      if (currentTime !== null) {
        setTime(currentTime);
      }
    });

    return () => {
      unsubscribeLED();
      unsubscribePassword();
      unsubscribeTmpPassword();
      unsubscribeTime();
    };
  }, [prevRem]);

  const handleSavePassword = () => {
    updateFirebase('PASSWORD', editedPassword);
    setPassword(editedPassword);
  };

  const handleChangeTmpPassword = () => {
    const newTmpPassword = Math.floor(1000 + Math.random() * 9000).toString();
  
    // Lấy thời gian hiện tại cộng thêm 24 giờ
    const newTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Cài đặt múi giờ Việt Nam (GMT+7)
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  
    // Định dạng thời gian theo múi giờ Việt Nam
    const formattedTime = formatter.format(newTime).replace(',', '').replace(' ', 'T'); // Chuyển sang định dạng "YYYY-MM-DDTHH:mm"
  
    updateFirebase('TMP_PASSWORD', newTmpPassword);
    updateFirebase('TIME', formattedTime);
  
    setTmpPassword(newTmpPassword);
    setTime(formattedTime);
  };
  
  
  

  const handleChangeTime = () => {
    if (newTime) {
      // Định dạng thời gian theo kiểu DD/MM/YYYYTHH:mm
      const formattedTime = new Date(newTime).toLocaleString('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', '').replace(' ', 'T'); // Chuyển đổi thành dạng "DD/MM/YYYYTHH:mm"
      
      updateFirebase('TIME', formattedTime); // Cập nhật thời gian vào Firebase
      setTime(formattedTime); // Cập nhật state time
    }
  };
  
  

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
                label="Khoá cửa, mở cửa"
                checked={rem === 'ON'}
                onChange={(e) => {
                  const newRemState = e.target.checked ? 'ON' : 'OFF';
                  setRem(newRemState);
                  updateFirebase('LED', newRemState);
                }}
                className="mb-2"
              />
            </Card.Body>
          </Card>
        </div>
      </div>

      <h4>Password cố định</h4>
      <div className="row mb-4">
        <div className="col-md-12">
          <Card>
            <Card.Body className="text-center">
              <div className="password-input-wrapper" 
                style={{ 
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',   // Căn giữa theo chiều ngang
                  alignItems: 'center',       // Căn giữa theo chiều dọc
                  width: '100%',              // Đảm bảo ô chứa chiếm toàn bộ chiều rộng
                }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={editedPassword}
                  onChange={(e) => setEditedPassword(e.target.value)}
                  className="mb-3"
                  style={{
                    width: '80%', // Đặt chiều rộng cho ô input
                  }}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '100px',  // Đặt icon con mắt ở bên phải ô input
                    top: '35Í%',     // Căn giữa theo chiều dọc
                    transform: 'translateY(-50%)',  // Căn giữa theo chiều dọc chính xác
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <Button variant="primary" onClick={handleSavePassword}>
                Save
              </Button>
            </Card.Body>
          </Card>
        </div>

        
      </div>

      {/* Sửa Time */}
      <h4>Password tạm thời</h4>

      <div className="row mb-4">
      <div className="col-md-6">
          <Card>
            <Card.Body className="text-center">
              <p><strong>TMP_PASSWORD:</strong> {tmpPassword}</p>
              <p><strong>Hết hạn:</strong> {time}</p>
              <Button variant="warning" onClick={handleChangeTmpPassword}>
                Change
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <Card>
            <Card.Body className="text-center">
              <h6>Chỉnh sửa thời gian hết hạn</h6>
              <Form.Control
                type="datetime-local"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)} // Chỉnh sửa thời gian
                className="mb-3"
              />
              <Button variant="secondary" onClick={handleChangeTime}>
                Save Time
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ButtonsSection;
