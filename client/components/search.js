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

    return (
      <div className="columns is-centered">
        <div>
          <form
            action="submit"
            name="symbol"
            onSubmit={evt => this.selectStock(evt)}
          >
            <input
              type="text"
              name="symbol"
              style={{width: '150px'}}
              placeholder="Enter a ticker symbol"
              autoComplete="off"
            />
            <button type="submit">Search</button>
          </form>
          {this.state.error && <small>{this.state.error}</small>}
          {this.state.symbol && (
            <SingleStock
              symbol={this.state.symbol}
              name={stocks[this.state.symbol].name}
            />
          )}
        </div>
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
