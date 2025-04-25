import { SetStateAction, useEffect, useState } from 'react';
import './uid.css'
import { BsCardHeading, BsPlus, BsSearch } from "react-icons/bs";
import {
    BsXSquareFill, BsCardText, BsCheckSquareFill,
    BsGrid3X3GapFill, BsListUl, BsArrowLeft, BsArrowRight
} from "react-icons/bs";
import { HiCheckCircle } from "react-icons/hi2";
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css';
// import { sessionToken } from '../../middlewares/authentication';

const UID = () => {
    //// add-user-modal
    const [addUser, setAddUser] = useState(false);
    const toggleAddUser = () => {
        setAddUser(!addUser)
    };
    const [addLoad, setAddLoad] = useState(false);
    const toggleAddLoad = () => {
        setAddLoad(!addLoad)
        setNewBalance("");
    };
    const [isDelete, setIsDelete] = useState(false);
    const toggleIsDelete = () => {
        setIsDelete(!isDelete)
    };
    const [isCardView, setIsCardView] = useState(true);
    const toggleIsCardView = () => {
        setIsCardView(true);
        setIsListView(false);
    };
    const [isListView, setIsListView] = useState(false);
    const toggleIsListView = () => {
        setIsListView(true);
        setIsCardView(false);
    };

    const [tapState, setTapState] = useState('')
    const [uid, setUid] = useState('')
    const [bal, setBal] = useState('')
    const [newBalance, setNewBalance] = useState('');
    const [fare, setFare] = useState('');

    const [selectedCard, setSelectedCard] = useState({ uid: 0, bal: 0 });
    const handleSelect = (card: SetStateAction<{ uid: number; bal: number; }>) => {
        setSelectedCard(card);
    };

    const [cards, setCards] = useState<Cards[]>([]);
    interface Cards {
        uid: number;
        bal: number;
        tapState: string;
    }

    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = () => {
        fetchCards();
    };
    const handleSearchInput = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchQuery(e.target.value);
    };
    const filteredCards = cards.filter((card) =>
        card.uid.toString().includes(searchQuery)
    );

    /////////////////pagination
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 8;
    const itemsPerPage = 8;

    /////////////////////////////

    const handleCreate = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}cards/creating-card`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('TICKETING-AUTH') as string

                },
                body: JSON.stringify({ uid, bal/* , authorization: jwt_Token */ }),
            });
            const newCard = await response.json();
            if (response.ok) {
                Store.addNotification({
                    title: "CREATED!",
                    message: "Card created successfully!",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
            } else {
                console.error('UID is already existing.');
                Store.addNotification({
                    title: "OOPS.",
                    message: newCard.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
            }
        } catch (error) {
            console.error('Error creating card:', error);
        }
    };

    const handleGenerate = async () => {
        if (uid.length !== 10 || parseInt(uid) === 0) {
            console.error('UID must be 10 digits long');
            Store.addNotification({
                title: "OOPS.",
                message: "UID must be 10 digits long and not zero.",
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

        const parsedBal = parseFloat(bal);
        if (isNaN(parsedBal) || parsedBal <= Number(fare) || parsedBal > 1000) {
            console.error('Invalid balance value.');
            Store.addNotification({
                title: "OOPS.",
                message: "Invalid balance value. Balance must be between minimum fare and 1000.",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated animate__bounceIn"],
                animationOut: ["animate__animated animate__slideOutRight"],
                dismiss: {
                    duration: 2000,
                }
            });

            setBal("");
            return;
        }

        await handleCreate();
        toggleAddUser();
    };

    const fetchFare = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}adminConfigs/fare`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const fetchedFare = await response.json();
                setFare(fetchedFare);
            } else {
                console.error('Failed to fetch fare');
            }
        } catch (error) {
            console.error('Error fetching fare:', error);
        }
    };

    const fetchCards = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}cards?uid=${uid}&bal=${bal}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const fetchedCards = await response.json();
                setCards(fetchedCards);
            } else {
                console.error('Failed to fetch cards');
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    useEffect(() => {
        fetchCards();
        fetchFare();
    }, [addUser, addLoad]);

    const handleAddBalance = async () => {
        const parsedNewBalance = parseFloat(newBalance);
        if (parsedNewBalance <= Number(fare)) {
            // console.error('Load must be above zero.');
            Store.addNotification({
                title: "OOPS.",
                message: "Load must be above minimum fare.",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated animate__bounceIn"],
                animationOut: ["animate__animated animate__slideOutRight"],
                dismiss: {
                    duration: 2000,
                }
            });
            setNewBalance('');
            return;
        }
        if (isNaN(parsedNewBalance) || parsedNewBalance > 1000) {
            console.error('Invalid balance value.');
            Store.addNotification({
                title: "OOPS.",
                message: "Invalid balance value. Balance must be between minimum fare and 1000.",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated animate__bounceIn"],
                animationOut: ["animate__animated animate__slideOutRight"],
                dismiss: {
                    duration: 2000,
                }
            });
            setNewBalance('');
            return;
        }

        const currentTime = new Date().toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });


        try {
            const response = await fetch(`${process.env.REACT_APP_URL}cards/update-card/${selectedCard.uid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('TICKETING-AUTH') as string

                },
                body: JSON.stringify({
                    bal: selectedCard.bal + parseFloat(newBalance),
                    topUp: parseFloat(newBalance),
                    dateLoaded: currentTime,
                    // authorization: jwt_Token
                }),
            });
            const updatedCard = await response.json();
            if (response.ok) {
                setCards((prevCards) =>
                    prevCards.map((card) =>
                        card.uid === selectedCard.uid ? updatedCard : card
                    )
                );
                toggleAddLoad();
                setNewBalance('');
                Store.addNotification({
                    title: "NEW BALANCE!",
                    message: "Card loaded succesfuly!",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
            } else {
                console.error('Failed to update balance');
                Store.addNotification({
                    title: "OH NO!",
                    message: updatedCard.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
            }
        } catch (error) {
            console.error('Error updating balance', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}cards/${selectedCard.uid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('TICKETING-AUTH') as string
                },
                // body: JSON.stringify({ authorization: jwt_Token }),
            });
            const card = await response.json();
            if (response.ok) {
                setCards((prevCards) =>
                    prevCards.filter((card) => card.uid !== selectedCard.uid)
                );
                toggleIsDelete();
                Store.addNotification({
                    title: "DELETED!",
                    message: "Card deleted successfully!",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
            } else {
                // console.error('Failed to delete card');
                Store.addNotification({
                    title: "OH NO!",
                    message: card.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated animate__bounceIn"],
                    animationOut: ["animate__animated animate__slideOutRight"],
                    dismiss: {
                        duration: 2000,
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting card', error);
        }
    };

    //AUTO GENERATE CARD VALUES
    const generateRandomDigits = () => {
        const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        return randomNumber.toString();
    };

    const autoGenerateUid = () => {
        const generatedUid = `${generateRandomDigits()}`;
        setUid(generatedUid);
    };

    const autoBalance = () => {
        const autoBal = '70';
        setBal(autoBal);
    }

    useEffect(() => {
        autoGenerateUid();
        autoBalance();
    }, [addUser]);

    return (
        <div>
            <div className="app-container">
                <ReactNotifications />
            </div>
            <div className='modal-container'>
                {addUser && (
                    <div className='add-user'>
                        <div className='overlay'>
                            <div className='modal-content'>
                                <div className='title'>Create new card</div>
                                <div className="detail-container">
                                    <label className="label">UID:</label>
                                    <input className='input-container'
                                        type="number"
                                        value={uid}
                                        onChange={(e) => {
                                            let input = e.target.value;
                                            // Ensure only numbers are entered
                                            let onlyNums = input.replace(/[^0-9]/g, '');

                                            // Check if the input starts with zero and discard it
                                            if (onlyNums.startsWith('0')) {
                                                onlyNums = onlyNums.slice(1);
                                            }

                                            // Limit to 10 digits
                                            const limitedNums = onlyNums.slice(0, 10);
                                            setUid(limitedNums);
                                        }}
                                        placeholder='UID'
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E') {
                                                e.preventDefault();
                                            }
                                        }}
                                    ></input>
                                </div>
                                <div className="detail-container">
                                    <label className="label">BAL:</label>
                                    <input className='input-container'
                                        type="number"
                                        value={bal}
                                        onChange={(e) => {
                                            let input = e.target.value;
                                            let onlyNums = input.replace(/[^0-9]/g, '');

                                            if (onlyNums.startsWith('0')) {
                                                onlyNums = onlyNums.slice(1);
                                            }
                                            if (onlyNums !== '') {
                                                setBal(onlyNums);
                                            }
                                        }}
                                        placeholder='Balance'
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E') {
                                                e.preventDefault();
                                            }
                                        }}
                                    ></input>
                                </div>
                                <div className="add-card-btns">
                                    <button className='btn-cancel'
                                        onClick={toggleAddUser}>
                                        Close
                                        <BsXSquareFill size={18} /></button>
                                    <button className="btn-generate"
                                        onClick={handleGenerate}>
                                        Generate card</button>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="main-row">
                <div className="btn-add-user" onClick={toggleAddUser} >
                    <span className="text">+ Add new card</span>
                    <BsPlus className="icon" size={18} />
                </div>
                <div className="search">
                    <div className="search-bar">
                        <input type="text"
                            className="search-input"
                            placeholder="Enter UID"
                            value={searchQuery}
                            onChange={handleSearchInput}>
                        </input>
                        <button className='search-submit'
                            onClick={handleSearch}>
                            <BsSearch />
                        </button>
                    </div>
                </div>

                {/* view mode ////////////////////////////// */}

                {/* 
                <div className='view-options'>
                    <div className="view-mode">
                    
                    </div>
                    <div className="pagination">
                        <button onClick={() => setCurrentPage(currentPage - 1)}
                            className='prev'
                            disabled={currentPage === 1}>
                            <BsArrowLeft />
                        </button>
             
                        <button onClick={() => setCurrentPage(currentPage + 1)}
                            className='next'
                            disabled={currentPage === Math.ceil(filteredCards.length / cardsPerPage)}>
                            <BsArrowRight />
                        </button>
                    </div>
                </div>
 */}


                <div className="tab-logo">
                    <div className='count'>{cards.length}</div>
                    <BsCardHeading size={30} />
                </div>
            </div>

            <div className="bg-style">
                {isCardView && (
                    <div className="list-card">
                        {cards.map((card, index) => (
                            <div className="mrt-card" key={index} onClick={() => handleSelect(card)}>
                                <div className="card-details">
                                    <div className="uid-card">
                                        <div className={card.tapState ? 'HiCheckCircle green' : 'HiCheckCircle grey'}>
                                            <HiCheckCircle size={24} />
                                        </div>
                                        <div className='card-uid'>{card.uid}</div>
                                    </div>
                                    <div className="bal-card">PHP {card.bal}</div>
                                </div>
                                <div className="card-btns">
                                    <button className="btn-load" onClick={toggleAddLoad}>
                                        Load
                                    </button>
                                    <button className="btn-delete" onClick={toggleIsDelete}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='modal-container'>
                {addLoad && (
                    <div className='add-load'>
                        <div className='overlay'>
                            <div className='modal-content'>
                                <div className="load-details">
                                    <div className="detail-container">
                                        <label className="label">UID:</label>
                                        <div className="input-container"> {selectedCard.uid}</div>
                                    </div>
                                    <div className="detail-container">
                                        <label className="label">BAL:</label>
                                        <div className="input-container"> {selectedCard.bal}</div>

                                    </div>
                                    <div className="detail-container">
                                        <label className="label">Amount:</label>
                                        <input className="input-container"
                                            type="number"
                                            value={newBalance}
                                            onChange={(e) => {
                                                let input = e.target.value;
                                                let onlyNums = input.replace(/[^0-9]/g, '');

                                                if (onlyNums.startsWith('0')) {
                                                    onlyNums = onlyNums.slice(1);
                                                }

                                                if (onlyNums !== '') {
                                                    setNewBalance(onlyNums);
                                                }
                                            }}
                                            placeholder='Add amount'
                                            onKeyDown={(e) => {
                                                if (e.key === 'e' || e.key === 'E') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        ></input>
                                    </div>
                                </div>
                                <div className="load-btns">
                                    <button className='btn-cancel'
                                        onClick={toggleAddLoad}>
                                        Close
                                        <BsXSquareFill size={18} /></button>
                                    <button className="btn-generate"
                                        onClick={handleAddBalance}>
                                        Add Balance</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className='modal-container'>
                {isDelete && (
                    <div className='add-user'>
                        <div className='overlay'>
                            <div className='modal-content'>
                                <div className="detail-container">
                                    <label className="label">UID:</label>
                                    <div className="input-container">
                                        {selectedCard.uid}</div>
                                </div>
                                <div className="load-btns">
                                    <button className='btn-cancel'
                                        onClick={toggleIsDelete}>
                                        Cancel
                                        <BsXSquareFill size={18} /></button>
                                    <button className="btn-generate"
                                        onClick={handleDelete}>
                                        Confirm Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UID;