// src/components/ScrollableCardList/ScrollableCardList.jsx
import React from 'react'
import PropTypes from 'prop-types'
import UserCard from '../UserCard/UserCard'
import './ScrollableCardList.css'

const ScrollableCardList = ({
  title,
  description,
  items,
  onAccept,
  onReject,
  cardClassName,
  listClassName,
  itemClassName,
  children
}) => {
  return (
    <div className={`scrollable-card-list-container ${cardClassName}`}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <div className={`scrollable-list ${listClassName}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`scrollable-card-item ${itemClassName}`}
          >
            <UserCard user={item} /> {/* Agrega UserCard aquí */}
            {children(item)} {/* Luego llama a children */}
          </div>
        ))}
      </div>
      <p className="scroll-hint">Desplázate horizontalmente para ver más.</p>
    </div>
  )
}

ScrollableCardList.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  items: PropTypes.array.isRequired,
  onAccept: PropTypes.func, // onAccept y onReject podrían no ser requeridas si no siempre se usan
  onReject: PropTypes.func,
  cardClassName: PropTypes.string,
  listClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  children: PropTypes.func // children es una función que recibe item como argumento
}

export default ScrollableCardList
