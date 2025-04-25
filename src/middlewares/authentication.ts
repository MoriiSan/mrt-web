import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import jwt, { JwtPayload } from 'jsonwebtoken';


// export const sessionToken = localStorage.getItem('TICKETING-AUTH');

export const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const sessionToken = localStorage.getItem('TICKETING-AUTH');
        const handleSoleAuth = async () => {
            try {
                const auth = await fetch(`${process.env.REACT_APP_URL}auth/soleAuth`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: sessionToken || "",
                    },
                });
                // console.log(auth)
                if (auth.ok) {
                    return
                } else {
                    localStorage.removeItem('TICKETING-AUTH');
                    navigate('/')
                }
            } catch (e) {
                console.log(e)
                navigate('/')
            }
        }
        if (sessionToken) {
            handleSoleAuth()
        }
    }, [navigate]);

    const login = (token: string) => {
        localStorage.setItem('TICKETING-AUTH', token);
        navigate('/admin/uid');
    };

    const logout = () => {
        localStorage.removeItem('TICKETING-AUTH');
        navigate('/');
    }

    const isAuthenticated = () => {
        return !!localStorage.getItem('TICKETING-AUTH');
    };

    return { login, logout, isAuthenticated };
}

export default useAuth;