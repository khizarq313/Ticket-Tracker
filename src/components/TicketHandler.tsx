import { useEffect, useState } from "react";

type props = {
    authentication: boolean,
}

type TicketType = {
    checkedIn: boolean,
    entries: number,
    ticketId: string
}

const TicketHandler = ({authentication}: props) => {

    const [ ticketId, setTicketId ] = useState<string>("");
    const [ ticketEntries, setTicketEntries ] = useState<string>("");
    const [ serchTicketId, setSerchTicketId ] = useState<string>("");
    const [ min, setMin ] = useState<string>("");
    const [ sec, setSec ] = useState<string>("");
    const [ randomAlphabet, setRandomAlphabet ] = useState<string>("");
    const [ randomAlphabet2, setRandomAlphabet2 ] = useState<string>("");
    const [ serchedTicketPanel, setSerchedTicketPanel ] = useState<boolean>(false);
    const [ ticketCreatedPanel, setTicketCreatedPanel ] = useState<boolean>(false);
    const [ error404, setError404 ] = useState<boolean>(false);
    const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L",
        "M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    const [ currentTicketInfo, setCurrentTicketInfo ] = useState<TicketType>({
        checkedIn: false,
        entries: 1,
        ticketId: ""
    });

    useEffect(() => {
        setTicketId( randomAlphabet + randomAlphabet2 + min + sec );
    }, [randomAlphabet, randomAlphabet2, min, sec]);

    useEffect(() => {
        if(ticketId !== "") {
            checkDB();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketId]);

    const checkDB = async () => {
        if(parseInt(ticketEntries) > 0) {
            const url = "https://tickets-tracker-313-default-rtdb.asia-southeast1.firebasedatabase.app/TicketId" +
                ticketId + ".json";
            const response = await fetch(url);
            const ticketInfo = await response.json();
            if(ticketInfo !== null) {
                generateTicketId();
            } else {
                POSTTicketIdToDatabase();
            }
        }
    }

    const generateTicketId = () => {
        let randomNum = Math.floor((Math.random() * 26));
        setRandomAlphabet(alphabets[randomNum]);
        randomNum = Math.floor((Math.random() * 26));
        setRandomAlphabet2(alphabets[randomNum]);
        let tempTime = new Date();
        if(tempTime.getMinutes() < 10) {
            setMin( "0" + tempTime.getMinutes().toString());
        } else {
            setMin(tempTime.getMinutes().toString());
        }
        if(tempTime.getSeconds() < 10) {
            setSec("0" + tempTime.getSeconds().toString());
        } else {
            setSec(tempTime.getSeconds().toString());
        }
    }

    const POSTTicketIdToDatabase = async () => {
        const options = {
            method: "PUT",
            header: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                checkedIn: false,
                entries: ticketEntries,
                ticketId: ticketId,
            })
        }
        const url = 'https://tickets-tracker-313-default-rtdb.asia-southeast1.firebasedatabase.app/TicketId/' + 
            ticketId + ".json";
        const res = await fetch(
            url,
            options
        )
        if(!res) {
          console.log("Error Occured");
        }
        setTicketCreatedPanel(true);
    }

    const GETTicketIdToDatabase = async () => {
        if(serchTicketId !== "") {
            const url = 'https://tickets-tracker-313-default-rtdb.asia-southeast1.firebasedatabase.app/TicketId/' + 
            serchTicketId + ".json";
            const response = await fetch(url);
            const ticketInfo = await response.json();
            if( ticketInfo ) {
                setCurrentTicketInfo(ticketInfo);
                setSerchedTicketPanel(true);
            } else {
                setError404(true);
            }     
        }
    }

    const updateTicketInfo = async () => {
        const options = {
            method: "PUT",
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                checkedIn: true,
                entries: currentTicketInfo.entries,
                ticketId: currentTicketInfo.ticketId,
            })
        }
        const url = 'https://tickets-tracker-313-default-rtdb.asia-southeast1.firebasedatabase.app/TicketId/' + 
            currentTicketInfo.ticketId + ".json";
        const res = await fetch(
            url,
            options
        )
        if(!res) {
          console.log("Error Occured");
        }
        setSerchedTicketPanel(false);
    }

    const closePanel = () => {
        setTicketCreatedPanel(false);
        setTicketId("");
        setTicketEntries("");
    }

  return (
    <div className={ !authentication ? "tickets-panel" : "hidden" }>
        <div className="create-ticket-panel">
            {
                !ticketCreatedPanel && 
                <div>
                    <h1>Generate New Ticket</h1>
                    <span className="entries-panel">
                        <input type="text" placeholder="Number Of Entries" value={ticketEntries} className="entries-input"
                            inputMode="numeric" onChange={(e) => {setTicketEntries(e.target.value)}}/>
      	                <button className="forward-btn create-ticket-btn" onClick={generateTicketId}>
                            <span className="material-symbols-outlined">
                                east
                            </span>
                        </button>
                    </span>
                </div>
            }
            {
                ticketCreatedPanel && 
                <div>
                    <span className="expire-panel">
                        <button onClick={closePanel} className="back-btn">
                            <span className="material-symbols-outlined">
                                west
                            </span>
                        </button>
                        <h1>Ticket Info</h1>
                    </span>
                    <h1>Ticket Id : { ticketId }</h1>
                    <h1>Entries : { ticketEntries }</h1>
                </div>
            }
        </div>
        <hr className="line"/>
        <div className="check-ticket-panel">
            { !serchedTicketPanel && !error404 &&
                <div>
                    <h1>Search Ticket</h1>
                    <span className="search-panel">
                        <input type="text" className="serch-input" value={serchTicketId} placeholder="Enter Ticket Id" maxLength={6}
                            onChange={(e) => {setSerchTicketId(e.target.value.toUpperCase())}}/>
                        <button className="forward-btn" onClick={GETTicketIdToDatabase}>
                            <span className="material-symbols-outlined">
                                search
                            </span>
                        </button>
                    </span>
                </div>
            }
            {
                serchedTicketPanel && !error404 &&
                <div>
                    { 
                        !currentTicketInfo.checkedIn && 
                        <div>
                            <span className="search-header">
                                <button onClick={() => (setSerchedTicketPanel(false))} className="back-btn">
                                    <span className="material-symbols-outlined">
                                        west
                                    </span>
                                </button>
                                <button onClick={updateTicketInfo} className="forward-btn">
                                    <span className="material-symbols-outlined">
                                        person_remove
                                    </span>
                                </button>
                            </span>
                            <h1>Ticket Id : { currentTicketInfo.ticketId }</h1>
                            <h1>Entries : { currentTicketInfo.entries }</h1>
                        </div>
                    }
                    {
                        currentTicketInfo.checkedIn && 
                        <div>
                            <span className="expire-panel">
                                <button onClick={() => (setSerchedTicketPanel(false))} className="back-btn">
                                    <span className="material-symbols-outlined">
                                        west
                                    </span>
                                </button>
                                <h1>Ticket Expired</h1>
                            </span>
                            <h1>Ticket Id : { serchTicketId }</h1>
                            <h1>Entries : { currentTicketInfo.entries }</h1>
                        </div>
                    }
                </div>
            }
            {
                error404 && 
                <div>
                    <span className="expire-panel">
                        <button onClick={() => (setError404(false))} className="back-btn">
                            <span className="material-symbols-outlined">
                                west
                            </span>
                        </button>
                        <h1> Invalid Ticket Id </h1>
                    </span>
                    <h1>Ticket Id : { serchTicketId }</h1>
                </div>
            }
        </div>
    </div>
  )
}

export default TicketHandler