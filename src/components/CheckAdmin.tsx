import { useState } from 'react';

type props = {
    authentication: boolean,
    setAuthentication: (Status: boolean) => void;
} 

const CheckAdmin = ({authentication, setAuthentication}: props) => {

    const [ pass, setPass ] = useState<string>(""); 
    const [ showPass, setShowPass ] = useState<boolean>(false);
    const [ incorrectPass, setIncorrectPass ] = useState<boolean>(false);

    const checkPass = () => {
        if( pass === "RONALDO") {
            setAuthentication(false);
        } else {
            setIncorrectPass(true);
        }
    }

  return (
    <div className={ authentication ? "authentication-panel" : "hidden" }>
        { !incorrectPass && 
        <div>
            <h1>Enter Password</h1>
            <div className='password-input'>
                { showPass && <input type="text" placeholder='Password' value={pass} onChange={(e) => (setPass(e.target.value.toUpperCase()))}/> }
                { !showPass && <input type="password" placeholder='Password' value={pass} onChange={(e) => (setPass(e.target.value.toUpperCase()))}/> }
                <button className='show-pass-btn' onClick={() => (setShowPass(!showPass))}>
                    { !showPass && 
                        <span className="material-symbols-outlined">
                            visibility_off
                        </span> 
                    }
                    {
                        showPass && 
                        <span className="material-symbols-outlined">
                            visibility
                        </span>
                    }
                </button>
            </div>
            <button className='check-pass-btn' onClick={checkPass}>
            <span className="material-symbols-outlined">
                east
            </span>
            </button>
        </div>
        }
        { incorrectPass && 
            <div>
                <h1>Incorrect Password</h1>
                <button className='try-again-pass-btn' onClick={() => (setIncorrectPass(false))}>Try again.</button>
            </div>
        }
    </div>
  )
}

export default CheckAdmin