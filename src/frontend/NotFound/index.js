import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const NotFound = ({ className }) => {
  return (
    <div className={className}>
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/">Go to home</Link>
    </div>
  )
}

NotFound.propTypes = {
  className: PropTypes.string.isRequired,
}

export default styled(NotFound)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  color: #007506ff;

  h1 {
    font-size: 5rem;
    color: #007506ff;
  }
`