import { useEffect, useState } from 'react';
import { BsTrainFront } from 'react-icons/bs';
import { useAuth } from '../middlewares/authentication';
import './navbar.css'
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isCardSelected, setIsCardSelected] = useState(false);
    const [isStationSelected, setIsStationSelected] = useState(false);

    const handleCardClick = () => { setIsCardSelected(true); setIsStationSelected(false); };
    const handleStationClick = () => { setIsCardSelected(false); setIsStationSelected(true); };
    const handleLogoClick = () => {
        setIsCardSelected(false); setIsStationSelected(false);
        navigate('/admin');
    };

    const { logout, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // useEffect(() => {
    //     if (isCardSelected || isStationSelected) {
    //         window.location.reload();
    //     }
    // }, [isCardSelected, isStationSelected]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div>
            <div className="navbar">
                <div className="logo-layout" >
                    <BsTrainFront size={30}></BsTrainFront>
                    <div className="logo-name"> MRT</div>
                </div>
                <div className="options">
                    <NavLink
                        to="uid"
                        className={`cards ${isCardSelected ? 'selected' : ''}`}
                        onClick={handleCardClick}>
                        Cards</NavLink>
                    <NavLink
                        to="stations"
                        className={`stations ${isStationSelected ? 'selected' : ''}`}
                        onClick={handleStationClick}>
                        Stations</NavLink>
                </div>
                <div className="logout"
                    onClick={handleLogout} >Logout</div>
            </div>
        </div>
    );
}

export default Navbar;