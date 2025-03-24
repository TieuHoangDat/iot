import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import background from '../assets/background.png'; // Import ảnh nền

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'dat' && password === '123') {
      setMessage('Đăng nhập thành công!');
      localStorage.setItem('username', username);
      navigate('/home');
    } else {
      setMessage('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card shadow-sm" style={{ width: '350px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px' }}>
        <div className="card-body">
          <h2 className="text-center">Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label>Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block w-100">
              Đăng nhập
            </button>
          </form>
          {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
