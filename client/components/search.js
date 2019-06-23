import React from 'react'
import {connect} from 'react-redux'
import {fetchAllStocks, fetchSingleStock} from '../store'

class Search extends React.Component {
  componentDidMount() {
    this.props.fetchAllStocks()
  }

  render() {
    const {stocks, fetchSingleStock} = this.props
    console.log(stocks.length)
    return (
      <div>
        <p>{stocks.length}</p>
        <form
          action="submit"
          name="symbol"
          onSubmit={evt => fetchSingleStock(evt)}
        >
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

const mapDispatch = (dispatch, props) => ({
  fetchAllStocks: () => {
    dispatch(fetchAllStocks())
  },
  fetchSingleStock: evt => {
    evt.preventDefault()
    const symbol = evt.target.symbol.value
    props.history.push(`/stock/${symbol}`)
  }
})

export default connect(mapState, mapDispatch)(Search)
