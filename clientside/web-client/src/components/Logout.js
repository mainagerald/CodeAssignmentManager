import React from 'react'
import { useLocalStorageState } from '../util/useLocalState'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Logout = () => {
  console.log("log out component rendered");
  
    const[auth, setAuth] = useLocalStorageState("", "jwt");
    const navigate = useNavigate();

    function logout(){
      console.log("triggered logout");
        setAuth("");
        console.log("set auth to:", auth);
          navigate("/login");
        }
  return (
    <div>
      <Button onClick={logout}>
        Logout
      </Button>
    </div>
  )
}

export default Logout
