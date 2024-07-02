import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}) {
    const  { AccessToken } = useSelector(state => state.auth);

    if(AccessToken !== null) return children
    else return <Navigate to="/login" />
}

export default PrivateRoute;