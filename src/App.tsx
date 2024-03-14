import { useState } from "react";
import CheckAdmin from "./components/CheckAdmin";
import TicketHandler from "./components/TicketHandler";

function App() {
	const [ authentication, setAuthentication ] = useState<boolean>(true);




  return (
    <div className="App">
      <h1 className="app-title"> Tickets Tracker </h1>
      <CheckAdmin authentication={authentication} setAuthentication={setAuthentication}/>
		  <TicketHandler authentication={authentication} />
    </div>
  );
}

export default App;
