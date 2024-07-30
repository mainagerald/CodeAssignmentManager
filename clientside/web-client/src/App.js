import logo from './logo.svg';
import './App.css';

function App() {
  fetch("http://localhost:8888/api/auth/signin",{
    headers:{
      "Content-Type":"application/json"
    },
    method: "post"
  });

  return (
    <div className="App">
      <p>We are coding!</p>
    </div>
  );
}

export default App;
