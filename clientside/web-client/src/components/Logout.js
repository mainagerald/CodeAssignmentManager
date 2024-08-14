import React from 'react'
import { useLocalStorageState } from '../util/useLocalState'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Logout = () => {
    const[auth, setAuth] = useLocalStorageState("", "jwt");
    const navigate = useNavigate();
    function logout(){
        setAuth("");
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
