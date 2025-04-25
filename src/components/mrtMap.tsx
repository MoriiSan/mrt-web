import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import { Icon } from "leaflet";
import { IoEnterOutline } from "react-icons/io5";
import { RiUserLocationLine, RiArrowGoBackFill } from "react-icons/ri";
import { PiListBulletsBold } from "react-icons/pi";
import { TbCurrencyPeso } from "react-icons/tb";
import { Store } from 'react-notifications-component';
import MapFly from './mapFly';
import './mrtMap.css';
import { Graph } from 'graphlib';
import QRCode from 'qrcode.react';


interface Markers {
    _id: string;
    stationName: string;
    stationCoord: [number, number];
    stationConn: string[];
}

interface Cards {
    uid: number;
    bal: number;
    tapState: string
}

const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/4551/4551380.png",
    //#0091ea
    iconSize: [50, 50]
})
const selectedIcon = new Icon({
    iconUrl: "   https://cdn-icons-png.flaticon.com/512/5216/5216456.png ",
    iconSize: [80, 80]
});

const MyMarker = ({ position, children, onClick, eventHandlers, isSelected }: any) => {
    const [adjustedPosition, setAdjustedPosition] = useState<[number, number]>(position);

    useEffect(() => {
        if (isSelected) {
            setAdjustedPosition([position[0] + 0.0034, position[1]]);
        } else {
            setAdjustedPosition([position[0] + 0.002, position[1]]);
        }
    }, [isSelected, position]);

    return (
        <Marker position={adjustedPosition} icon={isSelected ? selectedIcon : customIcon}
            eventHandlers={eventHandlers}>
        </Marker>
    );
};

////////////////////////////////
////////////////////////////////
const MrtMap = ({ onClick }: any) => {
    const [stations, setStations] = useState<Markers[]>([]);
    const [selectedStation, setSelectedStation] = useState<Markers | null>(null);
    const [uidInput, setUidInput] = useState('');
    const [uid, setUid] = useState<number | null>(null);
    const [submit, setSubmit] = useState(false);
    const [graph, setGraph] = useState<Graph | null>(null);
    const [cutTicket, setCutTicket] = useState(true);


    /* TAP IN /////////////// */
    const [tapState, setTapState] = useState('');


    /* TAP OUT ///////////// */
    const [ticket, setTicket] = useState(false);
    const [fare, setFare] = useState<number>(0);
    const [totalFare, setTotalFare] = useState<number>(0);
    const [initialBal, setInitialBal] = useState<number>(0);
    const [finalBal, setFinalBal] = useState<number>(0);
    const [stationIn, setStationIn] = useState('');
    const [stationOut, setStationOut] = useState('');
    const [distance, setDistance] = useState();
    const [route, setRoute] = useState<string[]>([]);


    const navigate = useNavigate();
    const tapInUrl = (stationName: string, tapState: string) => {
        const url = `/mrt/${stationName}/${tapState}`;
        navigate(url);
    };
    const tapOutUrl = (stationName: string, tapState: string) => {
        const url = `/mrt/${stationName}/${tapState}`;
        navigate(url);
    };

    const toggleSubmitOff = () => {
        setSubmit(false);
        setTicket(false);
        setStationIn("")
        setStationOut("")
        setUidInput("");
        setDistance(undefined)
        navigate('/mrt');
    }

    const leaveStation = async () => {
        setCutTicket(false);

        setTimeout(async () => {
            const currentTime = new Date().toLocaleString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            try {
                // Update the database with the final balance immediately
                const response = await fetch(`${process.env.REACT_APP_URL}cards/user-update-card/${uidInput}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bal: finalBal, dateTravel: currentTime, charge: totalFare })
                });

                if (response.ok) {
                    setSubmit(false);
                    setTicket(false);
                    setUidInput("");
                    navigate('/mrt');
                    setSelectedStation(null);
                    setRoute([]);
                    setCutTicket(true);
                } else {
                    console.error('Failed to update card balance');
                }
            } catch (error) {
                console.error('Error updating card balance:', error);
            }
        }, 2000);
    };

    const fetchStations = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}stations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const fetchedStations = await response.json();
                setStations(fetchedStations);
            } else {
                console.error('Failed to fetch stations');
            }
        } catch (error) {
            console.error('Error fetching stations:', error);
        }
    };

    const fetchCard = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}cards/${uidInput}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const fetchedCard = await response.json();
            if (response.ok) {
                setUid(fetchedCard.uid)
                setInitialBal(fetchedCard.bal)
                setStationIn(fetchedCard.tapState)
                traveledDistance(fetchedCard.tapState, selectedStation!.stationName)

            } else {
                // console.error('Failed to fetch cards');

            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    const checkBalance = async () => {
        if (uidInput.trim() === "") {
            console.error('UID is blank');
            Store.addNotification({
                title: "BLANK!",
                message: "There is no UID input.",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated animate__bounceIn"],
                animationOut: ["animate__animated animate__slideOutRight"],
                dismiss: {
                    duration: 2000,
                }
            });
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}cards/${uidInput}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const card = await response.json();
            if (response.ok) {
                setUid(card.uid);
                setInitialBal(card.bal);
                setSubmit(true)
                console.log('Balance check:', card.bal)
            } else {
                Store.addNotification({
                    title: "OOPS!",
                    message: card.message,
                    type: "warning",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
                return;
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }

    const handleTapIn = async () => {
        if (uidInput.trim() === "") {
            console.error('UID is blank');
            Store.addNotification({
                title: "BLANK!",
                message: "There is no UID input.",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated animate__bounceIn"],
                animationOut: ["animate__animated animate__slideOutRight"],
                dismiss: {
                    duration: 2000,
                }
            });
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_URL}cards/tapIn/${uidInput}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tapState: selectedStation?.stationName })
            });

            if (response.ok) {
                const card = await response.json();
                setUid(card.uid);
                setInitialBal(card.bal);
                setTapState(card.tapState)
                setSubmit(true)
                if (selectedStation) {
                    tapInUrl(selectedStation.stationName, 'In');
                    Store.addNotification({
                        title: "TAP IN SUCCESS!",
                        // message: "Tap in Success",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated animate__bounceIn"],
                        animationOut: ["animate__animated animate__slideOutRight"],
                        dismiss: {
                            duration: 2000,
                        }
                    });
                    return;
                }
            } else {
                const card = await response.json();
                Store.addNotification({
                    title: "OOPS!",
                    message: card.message,
                    type: "warning",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
                return;
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };


    const getFare = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}adminConfigs/fare`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const fetchedFare = await response.json();
                setFare(fetchedFare)
            } else {
                console.error('Failed to fetch fare');
            }
        } catch (error) {
            console.error('Error fetching fare:', error);
        }
    }

    const penaltyBal = initialBal - fare;

    const handleTapOut = async () => {
        if (uidInput.trim() === "") {
            console.error('UID is blank');
            Store.addNotification({
                title: "BLANK!",
                message: "There is no UID input.",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated animate__bounceIn"],
                animationOut: ["animate__animated animate__slideOutRight"],
                dismiss: {
                    duration: 2000,
                }
            });
            return;
        }

        console.log('totalFare: ', totalFare, 'bal: ', initialBal)
        if (totalFare + 1 >= initialBal) {
            console.log('Insufficient balance to tap out');
            Store.addNotification({
                title: "OOPS",
                message: 'Insufficient balance to tap out',
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated animate__bounceIn"],
                animationOut: ["animate__animated animate__slideOutRight"],
                dismiss: {
                    duration: 2000,
                }
            });
            return;
        }

        fetchCard();

        try {
            const response = await fetch(`${process.env.REACT_APP_URL}cards/tapOut/${uidInput}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tapState: '' })
            });

            if (response.ok) {
                const card = await response.json();
                setStationIn(card.tapState)
                setStationOut(selectedStation ? selectedStation.stationName : '');
                setSubmit(false)
                setTicket(true)
                if (stationIn === selectedStation!.stationName) {
                    setFinalBal(penaltyBal);
                    getRoute(card.tapState, selectedStation ? selectedStation.stationName : '')
                    const tempVal = await traveledDistance(card.tapState, selectedStation ? selectedStation.stationName : '')
                    console.log('finalBal:', card.bal - fare)
                    tapOutUrl(selectedStation!.stationName, 'Out');
                    Store.addNotification({
                        title: "TAP OUT SUCCESS",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated animate__bounceIn"],
                        animationOut: ["animate__animated animate__slideOutRight"],
                        dismiss: {
                            duration: 2000,
                        }
                    });
                    return;
                } else {
                    getRoute(card.tapState, selectedStation ? selectedStation.stationName : '')
                    const tempVal = await traveledDistance(card.tapState, selectedStation ? selectedStation.stationName : '')
                    setFinalBal(card.bal - Math.round(Number(tempVal)))
                    console.log('finalBal:', card.bal - Number(tempVal))
                    // console.log('total fare:', tempVal)
                    tapOutUrl(selectedStation!.stationName, 'Out');
                    Store.addNotification({
                        title: "TAP OUT SUCCESS",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated animate__bounceIn"],
                        animationOut: ["animate__animated animate__slideOutRight"],
                        dismiss: {
                            duration: 2000,
                        }
                    });
                    return;
                }
            } else {
                const card = await response.json();
                Store.addNotification({
                    title: "OOPS!",
                    message: card.message,
                    type: "warning",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
                setUidInput('');
                setUid(null);
                return;
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }

    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    const traveledDistance = async (initialStation: string, finalStation: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}stations/traveled-distance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initialStation, finalStation })
            });
            if (response.ok) {
                const distanceTraveled = await response.json();
                // console.log(distanceTraveled)
                setDistance((distanceTraveled.distance).toFixed(1))
                console.log('Distance: ', (distanceTraveled.distance).toFixed(1), 'Km')
                if (stationIn === selectedStation!.stationName) {
                    setTotalFare(fare);
                    return fare;
                } else {
                    setTotalFare(Math.round(Number((fare * distanceTraveled.distance).toFixed(1))));
                    console.log('Total Fare: ', ((fare * distanceTraveled.distance).toFixed(1)))
                    return Math.round(Number((fare * distanceTraveled.distance).toFixed(1)))
                }
            } else {
                console.error('Error setting edge distances');
            }
        } catch (error) {
            // console.error('Error fetching stations:', error);
        }
    };

    const getRoute = async (initialStation: string, finalStation: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}stations/get-route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initialStation, finalStation })
            });
            if (response.ok) {
                const routeTraveled = await response.json();
                setRoute(routeTraveled)
                // console.log(routeTraveled)
            } else {
                console.error('Error setting edge distances');
            }
        } catch (error) {
            console.error('Error fetching stations:', error);
        }
    };


    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////



    const displayPolylines = (stations: Markers[]) => {
        const polylines: JSX.Element[] = [];
        const connections: Set<string> = new Set();
        stations.forEach((station) => {
            station.stationConn.forEach((stationConnected) => {
                const direction = `${station.stationName}-${stationConnected}`;
                const reverseDirection = `${stationConnected}-${station.stationName}`;

                if (!connections.has(direction) && !connections.has(reverseDirection)) {
                    const stationConnectedData = stations.find(
                        (s) => String(s.stationName) === String(stationConnected)
                    );

                    if (stationConnectedData) {
                        polylines.push(
                            <Polyline
                                key={direction}
                                color="#202020"
                                weight={5}
                                dashArray="13"
                                positions={[
                                    station.stationCoord,
                                    stationConnectedData.stationCoord,
                                ]} />);
                        connections.add(direction);
                        connections.add(reverseDirection);
                    }
                }
            });
        });
        return polylines;
    };

    const displayRoutePolylines = (route: string[]) => {
        const routePolylines: JSX.Element[] = [];
        for (let i = 0; i < route.length - 1; i++) {
            const initialStation = stations.find(station => station.stationName === route[i]);
            const finalStation = stations.find(station => station.stationName === route[i + 1]);
            if (initialStation && finalStation) {
                routePolylines.push(
                    <Polyline
                        key={`route-${i}`}
                        positions={[
                            initialStation.stationCoord,
                            finalStation.stationCoord
                        ]}
                        color="#d03f33"
                        weight={6}
                    />
                );
            }
        }
        return routePolylines;
    };


    useEffect(() => {
        getFare();
        fetchStations();
        navigate('/mrt');
        toggleSubmitOff();
    }, []);

    useEffect(() => {
        if (uidInput.length === 10) {
            fetchCard();
        }
    }, [uidInput]);


    return (
        <div onClick={() => { }}>
            <MapContainer
                className="mapUser-container"
                center={[14.596325, 121.027794]}
                zoom={13}
                scrollWheelZoom={true}
                minZoom={12}
                maxZoom={14}
                zoomControl={false}
                doubleClickZoom={false}>
                <TileLayer
                    url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=Rs3yx5aveNteEw7myffiDtutSEcX3b0zdHPWxOQbMjJyX6vCRNe4ZYLts8ya6wOI"
                    attribution='&copy; <a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>'
                />

                {stations.map((station, index) => (
                    <MyMarker key={index}
                        position={[station.stationCoord[0], station.stationCoord[1]]}
                        isSelected={selectedStation === station}
                        eventHandlers={{
                            click: () => (setSelectedStation(station), toggleSubmitOff())
                        }}>
                        {/* {station.stationName} */}
                        <Popup>{station.stationName}</Popup>
                    </MyMarker>
                ))}

                {displayPolylines(stations)}
                {displayRoutePolylines(route)}
                {/* {linesTraveled(stations, stationIn, finalStation)} */}

                <MapFly station={selectedStation} zoom={12} />

            </MapContainer>

            {selectedStation !== null && (
                <div>
                    {!ticket && (
                        <div className="tapState-prompt">
                            <div className="tapState-indicator"></div>
                            <div className="tapState-container">
                                <div className="tapState-station">
                                    <RiUserLocationLine />
                                    {selectedStation?.stationName.toUpperCase()}
                                </div>
                                <div className='qrContainer'>
                                    <QRCode value={selectedStation.stationName} />
                                </div>
                                {!submit && (
                                    <>
                                        <div className="uid-input-container">
                                            <div className="uid-label">UID:</div>
                                            <input className="uid-input"
                                                placeholder="Input UID"
                                                type="number"
                                                value={uidInput}
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    const onlyNums = input.replace(/[^0-9]/g, '');
                                                    const limitedNums = onlyNums.slice(0, 10);
                                                    setUidInput(limitedNums);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'e' || e.key === 'E') {
                                                        e.preventDefault();
                                                    }
                                                }}>
                                            </input>
                                        </div>
                                        <div className="checkBal-btn"
                                            onClick={checkBalance}>
                                            Check Balance
                                        </div>
                                        <div className="tapState-btns">
                                            <div className="tapIn"
                                                onClick={handleTapIn}
                                            >Tap In</div>
                                            <div className="tapOut"
                                                onClick={handleTapOut}>Tap Out</div>
                                        </div>
                                    </>
                                )}

                                {submit && (
                                    <>
                                        <div className="user-card">
                                            <img className="tapCard-icon"
                                                src="https://cdn-icons-png.flaticon.com/512/674/674896.png ">
                                            </img>
                                            <div className="cancel-submit"
                                                onClick={toggleSubmitOff}
                                            >
                                                <RiArrowGoBackFill size={20} />
                                            </div>
                                            <div className="uid-display">
                                                <div className="uid-text"></div>
                                                <div className="uid-value">{uid}</div>

                                            </div>
                                            <div className="balance-display">
                                                <div className="bal-text">BALANCE</div>
                                                <div className="bal-value">{`PHP ${initialBal}`}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                    )}


                </div>
            )}
            <div className="station-note">
                <div className="note-modal-indicator">
                    Notes
                </div>
                <div className="note-contents">
                    <label className="note-label">
                        <div className="PiListBulletsBold">
                            <PiListBulletsBold size={20} />
                        </div>
                        <label>Click station to board.</label>
                    </label>
                </div>
            </div>


            {/* ticket ///////////////// */}
            {ticket && (
                <div className={`ticket-container ${ticket ? 'show' : ''}`}>
                    <div className={cutTicket ? "ticket-top show" : "ticket-top"}>
                        <div className="another-inner-top">
                            <div className="ticket-uid-label">UID
                                <div className="ticket-uid"><strong>{uid}</strong></div>
                            </div>
                            <div className="ticket-bal-label">BALANCE
                                <div className="ticket-bal"><strong> PHP {initialBal}</strong></div>
                            </div>
                        </div>
                        <div className="inner-top">
                            <div className="initial-station-label">Depart</div>
                            <div className="initial-station">{stationIn}</div>
                            <img className="line-direction"
                                src="https://cdn-icons-png.flaticon.com/512/2473/2473536.png "></img>
                            <div className="final-station-label">Arrive</div>
                            <div className="final-station">{stationOut}</div>
                        </div>
                    </div>
                    <div className="ticket-bottom"
                        onClick={leaveStation}>
                        <div className="inner-bottom">
                            <div className="inner-bottom-left">
                                <div className="distance-label">
                                    <label className="dist-label">Total Distance:</label>
                                    <div><strong>{distance}km</strong> </div>
                                </div>
                                <div className="new-bal-label">
                                    <label className="newbal-label">New Balance:</label>
                                    <div className="new-total"><strong>PHP {finalBal}</strong></div>
                                </div>
                            </div>
                            <div className="inner-bottom-right">
                                <div className="ticket-fare-text">Total Fare</div>
                                <div className="ticket-fare-label">
                                    <TbCurrencyPeso />
                                    {totalFare}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MrtMap;
