import React from 'react';
import './AdminPage.css';
import trainLogo from '../assets/train-logo.jpg'

const Admin = () => {
    return (
        <div className="admin-bg">
            <div className="admin-welcome">
                <img className="train-logo" src={trainLogo} alt='MRT System logo' />
                <div className="welcome-message">
                    <div className='welcome-text'>WELCOME TO</div>
                    <div className='mrt-text'>MRT SYSTEM</div>
                </div>
            </div>
        </div>
    );
}

export default Admin;