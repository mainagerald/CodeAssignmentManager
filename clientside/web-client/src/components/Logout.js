import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  console.log("log out component rendered");
  
const{logout} = useAuth();
    const navigate = useNavigate();

    function handleLogout(){
logout();
          navigate("/login");
        }
  return (
    <div>
      <Button onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}

export default Logout
