import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../middlewares/authentication';
import { ReactNotifications, Store } from 'react-notifications-component'
import Loader from '../components/Loader'
import 'react-notifications-component/dist/theme.css'
import 'animate.css';
import './Login.css';

export default function Login() {
    const [isHovered, setIsHovered] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const loginButton = {
        backgroundColor: isHovered ? '#fccd5d' : '#FBC034',
    };

    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/admin'); // navigate('card');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            // console.log(data)
            if (response.ok) {
                const sessionToken = data.sessionToken;
                // console.log('Received Token', sessionToken)
                login(sessionToken);

            } else {
                Store.addNotification({
                    title: "OOPS!",
                    message: data.message,
                    type: "warning",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutUp"],
                    dismiss: {
                        duration: 2000,
                    }
                });
                setIsLoading(false);
            }
        } catch (error) {
            alert(`Error during login: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            {isLoading && <Loader />}
            <div className="notif">
                <div className="app-container">
                    <ReactNotifications />
                </div>
            </div>
            <div className="content">
                <header className='welcome'>Welcome to MRT</header>
                <div className="login-box">
                    <input className='username'
                        onChange={(e) => { setUsername(e.target.value) }}
                        placeholder='Username'
                    ></input>
                    <input className='password'
                        type='password'
                        onChange={(e) => { setPassword(e.target.value) }}
                        placeholder='Password'
                    ></input>
                    <button className='loginSubmit'
                        style={loginButton}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleLogin}
                    >Login
                    </button>
                </div>
            </div>
        </div>
    )
}
