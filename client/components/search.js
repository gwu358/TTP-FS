import React from 'react'
import {connect} from 'react-redux'
import {fetchAllStocks} from '../store'

class Search extends React.Component {
  componentDidMount() {
    this.props.fetchAllStocks()
  }

  render() {
    const {stocks, selectStock} = this.props
    console.log(stocks.length)
    return (
      <div>
        <p>{stocks.length}</p>
        <form action="submit" name="symbol" onSubmit={evt => selectStock(evt)}>
          <input
            className="input"
            type="text"
            name="symbol"
            placeholder="Enter a ticker symbol"
          />
        </form>
      </div>
    )
  }
}
const mapState = state => ({
  stocks: state.stocks
})

const mapDispatch = (dispatch, props) => ({
  fetchAllStocks: () => {
    dispatch(fetchAllStocks())
  },
  selectStock: evt => {
    evt.preventDefault()
    const symbol = evt.target.symbol.value
    props.history.push(`/stock/${symbol}`)
  }
})

export default connect(mapState, mapDispatch)(Search)
