import React, { useEffect, useState } from 'react';
import './App.css';
import { useLocalStorageState } from './util/useLocalState';
import {Routes, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  const [auth, setAuth] = useLocalStorageState("", "jwt");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!auth){
      const login = async () => {
        setLoading(true);
        setError("");
        const requestBody = {
          email: "Admin@gmail.com",
          password: "123456"
        };
  
        try {
          const response = await fetch("http://localhost:8888/api/auth/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log(data);
          if (data.token) {
            setAuth(data.token);
          } else {
            setError("No token received in response");
          }
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      login();
    }
  }, []);

  return (
    // <div className="App">
    //   <p>We are coding!</p>
    //   {loading && <p>Loading...</p>}
    //   {error && <p>Error: {error}</p>}
    //   {auth && <p>Authenticated with token: {auth}</p>}
    // </div>
    <Routes>
      <Route path='/' element={()=>{return <div>Home</div>}}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
    </Routes>
  );
}

export default App;