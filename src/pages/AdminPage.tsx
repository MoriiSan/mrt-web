import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { Outlet } from 'react-router-dom';
// import './AdminPage.css';

const AdminPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPage;