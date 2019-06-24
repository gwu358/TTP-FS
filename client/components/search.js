import React from 'react'
import {connect} from 'react-redux'
import {fetchAllStocks} from '../store'

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
      this.setState({error: 'Please enter a value ticker symbol'})
    else if (!stocks[symbol].isEnabled)
      this.setState({
        error: `${stocks[symbol].name} (${symbol}) is currently disabled`
      })
    else {
      this.setState({error: undefined})
      this.props.history.push(`/stock/${symbol}`)
    }
  }

  render() {
    const {stocks} = this.props
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
          />
        </form>
        {this.state.error && <small>{this.state.error}</small>}
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
