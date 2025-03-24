import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Introduce from './pages/Introduce';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Không bọc Layout ở đây, để riêng cho Login */}
        <Route path="/login" element={<Login />} />

        {/* Dùng Layout cho toàn bộ PrivateRoute */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="home" element={<Dashboard />} />
                  <Route path="map" element={<Map />} />
                  <Route path="introduce" element={<Introduce />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
