import {useState}  from 'react';
import lineBigImage from '../assets/lineBig.png';
import './card.css';

export default function Card() {
    const [open] = useState(true);

    const UID = 123456789;
    const Bal = 500;
    const Fare = 13;
    const distance = 11;
    const loc = "Taft Avenue".toUpperCase();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })}`;

    return(
        <div className="card-container flex flex-col">
            <div className="flex flex-row ">
                <div className="basis-1/2">
                    <div>UID</div>
                    <div>{UID}</div>
                </div>
                <div className="basis-1/2">
                    <div className="flex flex-col">
                        <div>BAL</div>
                        <div>FARE</div>
                    </div>
                </div>
            </div>
            <div className="inner-card">
                <div>FROM: {loc}</div>
                <div className="location-arrow">
                    <img src={lineBigImage} alt="line arrow"></img>
                </div>
                <div>TO: DESTINATION</div>
            </div>



            
            
                {/* <div>DISTANCE</div> */}
        </div>
    )
}