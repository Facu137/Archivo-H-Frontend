// src/components/ToggleSwitch/ToggleSwitch.jsx
import React from 'react'
import PropTypes from 'prop-types'
import './ToggleSwitch.css'

const ToggleSwitch = ({ isOn, handleToggle, onColor }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
        className="toggle-switch-checkbox"
      />
      <span
        className="toggle-switch-slider"
        style={{ backgroundColor: isOn ? onColor : undefined }}
      />
    </label>
  )
}

ToggleSwitch.propTypes = {
  isOn: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  onColor: PropTypes.string
}

ToggleSwitch.defaultProps = {
  onColor: '#4BD865'
}

export default ToggleSwitch
