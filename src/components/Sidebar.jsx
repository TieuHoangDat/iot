import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="p-3 border-end vh-100 bg-white">
      <div className="text-center mb-4">
        <img
          src="111.png"
          alt="User"
          className="rounded-circle mb-2 shadow"
          width="80"
        />
        <h5 className="mt-2">Nhóm 14 👋</h5>
        <p className="text-muted">{username || 'Người dùng'}</p>
      </div>

      <ListGroup variant="flush">
        <ListGroupItem
          action
          href="/home"
          className={`py-3 ${location.pathname === "/home" ? "active bg-primary text-white" : ""}`}
        >
          <i className="bi bi-house-door-fill me-2"></i> Trang chủ
        </ListGroupItem>

        <ListGroupItem
          action
          href="/map"
          className={`py-3 ${location.pathname === "/map" ? "active bg-primary text-white" : ""}`}
        >
          <i className="bi bi-bar-chart-fill me-2"></i> Bản đồ
        </ListGroupItem>

        <ListGroupItem
          action
          href="/introduce"
          className={`py-3 ${location.pathname === "/introduce" ? "active bg-primary text-white" : ""}`}
        >
          <i className="bi bi-envelope-fill me-2"></i> Giới thiệu
        </ListGroupItem>

        <ListGroupItem
          action
          onClick={handleLogout}
          className="py-3 text-danger"
        >
          <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
        </ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
