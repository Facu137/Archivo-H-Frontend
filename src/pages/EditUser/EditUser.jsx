// src/pages/EditUser/EditUser.jsx
import React from 'react'
import RequestEmployeeCard from './RequestEmployeeCard/RequestEmployeeCard'
import ProfileForm from './ProfileForm/ProfileForm'
import './EditUser.css'

export const EditUser = () => {
  return (
    <div className="edit-user-container">
      <div className="edit-user-content">
        <RequestEmployeeCard />
        <ProfileForm />
      </div>
    </div>
  )
}
