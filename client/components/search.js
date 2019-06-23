import React from 'react'
import {connect} from 'react-redux'
import {fetchAllStocks, fetchSingleStock} from '../store'

class Search extends React.Component {
  componentDidMount() {
    console.log('do things')
    this.props.fetchAllStocks()
  }

  render() {
    const {stocks} = this.props
    console.log(stocks.length)
    return (
      <div>
        <p>{stocks.length}</p>
        <form action="submit" name="symbol" onSubmit={evt => getStock(evt)}>
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
  stocks: state.stock.all
})

const mapDispatch = dispatch => ({
  fetchAllStocks: () => {
    dispatch(fetchAllStocks())
  },
  fetchSingleStock: evt => {
    evt.preventDefault()
    const input = evt.target.symbol.value
    dispatch(fetchSingleStock(input))
  }
})

export default connect(mapState, mapDispatch)(Search)
