import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

import Home from './pages/Login'
import About from './pages/About'


function Test(){
    return (
        <BrowserRouter>
        <header>
            <nav>
                <h1>Jobarouter</h1>
                <Link to="/">Home</Link>
                <NavLink to="about">About</NavLink>
            </nav>
        </header>
            <main>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="about" element={<About />}/>
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default Test;