// src/pages/EditUser/EditUser.jsx
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import RequestEmployeeCard from './RequestEmployeeCard/RequestEmployeeCard'
import ProfileForm from './ProfileForm/ProfileForm'

export const EditUser = () => {
  const isDarkMode = localStorage.getItem('mode') === 'dark'

  return (
    <div className={`min-vh-100 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12}>
            <h1
              className={`text-center mb-4 ${isDarkMode ? 'text-white' : 'text-dark'}`}
            >
              Mi Perfil
            </h1>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          {/* Profile Form - Left side on desktop, top on mobile */}
          <Col xs={12} lg={6} className="order-2 order-lg-1">
            <div className="">
              <ProfileForm />
            </div>
          </Col>

          {/* Employee Card - Right side on desktop, bottom on mobile */}
          <Col xs={12} lg={6} className="order-1 order-lg-2">
            <div className="">
              <div className="sticky-lg-top" style={{ top: '2rem' }}>
                <RequestEmployeeCard />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
