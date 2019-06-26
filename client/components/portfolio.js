import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {updateBalance} from '../store'

class Portfolio extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  fetchData() {
    axios.get(`/api/userStocks`).then(res => {
      this.userStocks = res.data
      this.socket = require('socket.io-client')(
        'https://ws-api.iextrading.com/1.0/last'
      )
      let socket = this.socket
      socket.on('message', data => {
        try {
          data = JSON.parse(data)
          let last = Math.ceil(data.price * 100) / 100
          let size = data.size
          const state = {...this.state[data.symbol], last, size}
          this.setState({[data.symbol]: state})
        } catch (e) {
          console.error(e)
        }
      })
      socket.on('connect', () => {
        this.userStocks.forEach(stock => socket.emit('subscribe', stock.symbol))
      })

      let state = {}
      Promise.all(
        this.userStocks.map(stock => {
          state[stock.symbol] = {quantity: stock.quantity, sellQuantity: 0}
          return axios
            .get(`https://api.iextrading.com/1.0/stock/${stock.symbol}/ohlc`)
            .then(({data}) => {
              state[stock.symbol].open = data.open.price
              state[stock.symbol].last = data.close.price
              state[stock.symbol].size = 0
            })
        })
      ).then(() => {
        this.setState(state)
      })
    })
  }

  IncrementItem = symbol => {
    const state = {...this.state[symbol]}
    state.sellQuantity++
    this.setState({[symbol]: state})
  }

  DecreaseItem = symbol => {
    const state = {...this.state[symbol]}
    state.sellQuantity--
    this.setState({[symbol]: state})
  }

  editQuantity = (event, symbol) => {
    const state = {...this.state[symbol]}
    let num = Number(event.target.value)
    if (event.target.validity.valid) {
      state.sellQuantity = Math.min(num, state.quantity)
      this.setState({[symbol]: state})
    }
  }

  sell = (symbol, quantity) => {
    const state = {...this.state[symbol]}
    quantity *= -1
    // const symbol = this.props.symbol.toUpperCase()
    const price = state.last * 100
    axios.post('/api/transactions', {
      symbol,
      price,
      quantity
    })
    axios.put('/api/userStocks', {symbol, quantity})
    this.props.updateBalance(price * quantity)

    state.quantity -= state.sellQuantity
    state.sellQuantity = 0
    this.setState({[symbol]: state})
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {
    this.userStocks.forEach(stock => {
      this.socket.emit('unsubscribe', stock.symbol)
    })
  }

  render() {
    return (
      <div className="columns is-centered">
        <table className="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Symbol</th>
              <th>Share(s)</th>
              <th>
                <abbr title="Open Price">OP</abbr>
              </th>
              <th>
                <abbr title="Last Sell Price">LSP</abbr>
              </th>
              <th>
                <abbr title="Last Sell Size">LSS</abbr>
              </th>
              <th>
                <abbr title="Sell @ the Last Sell Price">Sell</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.state).map((symbol, i) => {
              const sellQuantity = this.state[symbol].sellQuantity
              const quantity = this.state[symbol].quantity
              return (
                <tr
                  key={i}
                  style={{
                    backgroundColor:
                      this.state[symbol].last > this.state[symbol].open
                        ? 'LightGreen'
                        : this.state[symbol].last < this.state[symbol].open
                          ? 'LightPink'
                          : 'LightGray'
                  }}
                >
                  <th>{i + 1}</th>
                  <td>{symbol}</td>
                  <td>{Math.abs(this.state[symbol].quantity)}</td>
                  <td>{this.state[symbol].open}</td>
                  <td>{(this.state[symbol].last || 0).toFixed(2)}</td>
                  <td>{this.state[symbol].size}</td>
                  <td>
                    <input
                      type="text"
                      pattern="[0-9]*"
                      style={{width: '80px'}}
                      value={sellQuantity}
                      onChange={evt => this.editQuantity(evt, symbol)}
                    />
                    <button
                      disabled={sellQuantity === quantity}
                      onClick={() => this.IncrementItem(symbol)}
                    >
                      ↑
                    </button>
                    <button
                      disabled={!sellQuantity}
                      onClick={() => this.DecreaseItem(symbol)}
                    >
                      ↓
                    </button>
                    <button
                      disabled={!quantity}
                      onClick={() => this.sell(symbol, sellQuantity)}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapState = state => {
  return {
    balance: state.user.balance
  }
}

const mapDispatch = dispatch => {
  return {
    updateBalance(total) {
      dispatch(updateBalance(total))
    }
  }
}

export default connect(mapState, mapDispatch)(Portfolio)
