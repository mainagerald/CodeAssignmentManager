import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [auth, setAuth] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <div className="App">
      <p>We are coding!</p>
      {/* {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}*/}
      {auth && <p>Authenticated with token: {auth}</p>}
    </div>
  );
}

export default App;