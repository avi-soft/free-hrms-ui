// PREVENTING AUTHENTICATED USERS FROM ACCESSING THIS ROUTE
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function OpenRoute({ children }) {
    const {AccessToken} = useSelector((state) => state.auth)

    if(AccessToken === null) return children
    else return <Navigate to="/" />
}

export default OpenRoute