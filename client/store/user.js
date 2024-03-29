import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const RELOAD_BALANCE = 'RELOAD_BALANCE'
const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const reloadBalance = balance => ({type: RELOAD_BALANCE, balance})
const clearErrorMessage = () => ({type: CLEAR_ERROR_MESSAGE})
/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (
  email,
  password,
  method,
  firstName,
  lastName
) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {
      email,
      password,
      firstName,
      lastName
    })
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

export const updateBalance = total => async (dispatch, getState) => {
  try {
    const balance = getState().user.balance - total
    await axios.put('/api/user', {balance})
    dispatch(reloadBalance(balance))
  } catch (err) {
    console.error(err)
  }
}

export const clearErrorResponse = () =>
  function(dispatch) {
    dispatch(clearErrorMessage())
  }
/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    case RELOAD_BALANCE:
      return {...state, balance: action.balance}
    case CLEAR_ERROR_MESSAGE:
      return {...state, error: {...state.error, response: undefined}}
    default:
      return state
  }
}
