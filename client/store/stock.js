import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ALL_STOCKS = 'GET_ALL_STOCKS'
const GET_SINGLE_STOCK = 'GET_SINGLE_STOCK'

/**
 * INITIAL STATE
 */
const initialState = {
  all: [],
  single: {}
}

/**
 * ACTION CREATORS
 */
const getAllStocks = stocks => ({type: GET_ALL_STOCKS, stocks})
const getSingleStock = stock => ({type: GET_SINGLE_STOCK, stock})
/**
 * THUNK CREATORS
 */
export const fetchAllStocks = () => async dispatch => {
  try {
    const res = await axios.get(
      'https://api.iextrading.com/1.0/ref-data/symbols'
    )
    console.log(res.data.length)
    dispatch(getAllStocks(res.data || initialState.all))
  } catch (err) {
    console.error(err)
  }
}

export const fetchSingleStock = symbol => async dispatch => {
  try {
    const res = await axios.get(
      `https://api.iextrading.com/1.0/stock/${symbol}/ohlc`
    )
    dispatch(getSingleStock(res.data || initialState.single))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_STOCKS:
      return {...state, all: action.stocks}
    case GET_SINGLE_STOCK:
      return {...state, single: action.stock}
    default:
      return state
  }
}
