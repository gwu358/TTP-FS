import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ALL_STOCKS = 'GET_ALL_STOCKS'
// const GET_SINGLE_STOCK = 'GET_SINGLE_STOCK'

/**
 * INITIAL STATE
 */
const initialState = {}

/**
 * ACTION CREATORS
 */
const getAllStocks = stocks => ({type: GET_ALL_STOCKS, stocks})
// const getSingleStock = stock => ({type: GET_SINGLE_STOCK, stock})
/**
 * THUNK CREATORS
 */
export const fetchAllStocks = () => async dispatch => {
  try {
    const res = await axios.get(
      'https://api.iextrading.com/1.0/ref-data/symbols'
    )
    let stocks = res.data.reduce((acc, el) => {
      acc[el.symbol] = {name: el.name, isEnabled: el.isEnabled}
      return acc
    }, {})
    dispatch(getAllStocks(stocks))
  } catch (err) {
    console.error(err)
  }
}

// export const fetchSingleStock = symbol => async dispatch => {
//   try {
//     const res = await axios.get(
//       `https://api.iextrading.com/1.0/stock/${symbol}/ohlc`
//     )
//     let stock
//     if (res.data) {
//       stock = res.data
//       stock.open = stock.open.price
//       stock.close = stock.close.price
//       stock.current = stock.close
//     }
//     dispatch(getSingleStock(stock || initialState))
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_STOCKS:
      return action.stocks
    default:
      return state
  }
}
