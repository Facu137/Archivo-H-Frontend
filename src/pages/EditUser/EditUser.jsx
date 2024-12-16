// src/pages/EditUser/EditUser.jsx
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import RequestEmployeeCard from './RequestEmployeeCard/RequestEmployeeCard'
import ProfileForm from './ProfileForm/ProfileForm'
import { useTheme } from '../../context/ThemeContext'

export const EditUser = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`min-vh-100 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12}>
            <h2
              className={`text-center mb-4 ${
                isDarkMode ? 'text-white' : 'text-dark'
              }`}
            >
              Mi Perfil
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center g-4">
          <Col xs={12} lg={6}>
            <ProfileForm />
          </Col>
          <Col xs={12} lg={6}>
            <RequestEmployeeCard />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
