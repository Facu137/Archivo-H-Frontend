// src/pages/EditUser/EditUser.jsx
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import RequestEmployeeCard from './RequestEmployeeCard/RequestEmployeeCard'
import ProfileForm from './ProfileForm/ProfileForm'

export const EditUser = () => {
  const isDarkMode = localStorage.getItem('mode') === 'dark'

  return (
    <Container
      fluid
      className={`py-4 min-vh-100 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
    >
      <Container>
        <Row className="g-4">
          <Col lg={6} className="order-1 order-lg-0">
            <ProfileForm />
          </Col>
          <Col lg={6} className="order-1 order-lg-0">
            <RequestEmployeeCard />
          </Col>
        </Row>
      </Container>
    </Container>
  )
}
