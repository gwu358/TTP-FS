import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth, clearErrorResponse} from '../store'

/**
 * COMPONENT
 */
class AuthForm extends React.Component {
  componentDidMount() {
    if (this.props.error && this.props.error.response)
      this.props.clearErrorResponse()
  }

  render() {
    const {name, displayName, handleSubmit, error} = this.props

    return (
      <div className="columns is-centered">
        <form onSubmit={handleSubmit} name={name}>
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="text" />
          </div>
          <br />

          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <br />
          {name === 'signup' && (
            <span>
              <div>
                <label htmlFor="firstName">
                  <small>First Name</small>
                </label>
                <input name="firstName" type="text" />
              </div>
              <br />

              <div>
                <label htmlFor="lastName">
                  <small>Last Name</small>
                </label>
                <input name="lastName" type="text" />
              </div>
              <br />
            </span>
          )}
          <div>
            <button type="submit">{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
        {/* <a href="/auth/google">{displayName} with Google</a> */}
      </div>
    )
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    clearErrorResponse() {
      dispatch(clearErrorResponse())
    },
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      const firstName =
        formName === 'signup' ? evt.target.firstName.value : null
      const lastName = formName === 'signup' ? evt.target.lastName.value : null
      dispatch(auth(email, password, formName, firstName, lastName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
