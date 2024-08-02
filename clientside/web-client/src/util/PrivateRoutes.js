import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLocalStorageState } from './useLocalState';

const PrivateRoute = ({children}) => {
    const [auth] = useLocalStorageState("", "jwt");
    return auth ? children : <Navigate to="/login"/>
}

export default PrivateRoute;
