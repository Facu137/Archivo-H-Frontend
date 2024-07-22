import React from 'react'
import './RightSidebar.css'
import { useAuth } from '../../context/AuthContext'

const RightSidebar = ({ isOpen }) => {
  const { user, logout } = useAuth()

  return (
    <div className={`right-sidebar ${isOpen ? 'open' : ''}`}>
      {user ? (
        <>
          <h3>User Details</h3>
          <p>
            Name: {user.nombre} {user.apellido}
          </p>
          <p>Email: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login to view your details.</p>
      )}
    </div>
  )
}

export default RightSidebar
