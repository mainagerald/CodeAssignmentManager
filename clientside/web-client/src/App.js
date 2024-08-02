import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import { useLocalStorageState } from './util/useLocalState';
import {Routes, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import AssignmentView from './components/AssignmentView';
import PrivateRoute from './util/PrivateRoutes';

function App() {
  const [auth, setAuth] = useLocalStorageState("", "jwt");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
        <Route path='/dashboard' 
        element={
          <PrivateRoute>
            <Dashboard/>
            </PrivateRoute>}
            />
            <Route
            path='/assignments/:id'
            element={
              <PrivateRoute>
                <AssignmentView/>
              </PrivateRoute>
            }/>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
    </Routes>
  );
}

export default App;