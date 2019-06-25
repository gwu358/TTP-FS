import React from 'react'
import {connect} from 'react-redux'
import {fetchAllStocks} from '../store'
import SingleStock from './singleStock'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.fetchAllStocks()
    console.log('fetch!')
  }

  selectStock(evt) {
    evt.preventDefault()
    const {stocks} = this.props
    const symbol = evt.target.symbol.value.toUpperCase()
    if (!stocks[symbol])
      this.setState({
        error: 'Please enter a valid ticker symbol',
        symbol: undefined
      })
    else if (!stocks[symbol].isEnabled)
      this.setState({
        error: `${stocks[symbol].name} (${symbol}) is currently disabled`,
        symbol: undefined
      })
    else {
      console.log(symbol)
      this.setState({error: undefined, symbol})
    }
  }

  render() {
    const {stocks} = this.props
    this.state.symbol && console.log(stocks[this.state.symbol])
    return (
      <div>
        <p>{Object.values(stocks).length}</p>
        <form
          action="submit"
          name="symbol"
          onSubmit={evt => this.selectStock(evt, stocks)}
        >
          <input
            className="input"
            type="text"
            name="symbol"
            placeholder="Enter a ticker symbol"
            autoComplete="off"
          />
        </form>
        {this.state.error && <small>{this.state.error}</small>}
        {this.state.symbol && (
          <SingleStock
            symbol={this.state.symbol}
            name={stocks[this.state.symbol].name}
          />
        )}
      </div>
    )
  }
}
const mapState = state => ({
  stocks: state.stocks
})

const mapDispatch = dispatch => ({
  fetchAllStocks: () => {
    dispatch(fetchAllStocks())
  }
})

export default connect(mapState, mapDispatch)(Search)
