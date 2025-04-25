import React from 'react';
import './mrtUser.css';
import SideBar from '../components/sideBar';
import Card from '../components/card';
import MrtMap from '../components/mrtMap';
import { ReactNotifications } from 'react-notifications-component';


const MrtUser = () => {

    return (
        <main/*  className="mrt-user" */>
            <div /* className="app-container" */>
                <ReactNotifications />
            </div>
            {/* <SideBar></SideBar> */}
            {/* <Card></Card> */}


            <div className="">
                <MrtMap />
            </div>


        </main>
    );
}

export default MrtUser;

