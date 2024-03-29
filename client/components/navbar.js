import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn, balance}) => (
  <div>
    <h1 className="title is-2 has-text-centered">TTPstock</h1>
    <nav>
      {isLoggedIn ? (
        <div className="title is-6 has-text-centered">
          {/* The navbar will show these links after you log in */}
          <Link to="/home">Home</Link>
          <Link to="/search">Market</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/transactions">Transactions</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
          <span>balance: $ {(balance / 100).toFixed(2)}</span>
        </div>
      ) : (
        <div className="title is-6 has-text-centered">
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    balance: state.user.balance
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
