import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'

class Portfolio extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  fetchData() {
    axios.get(`/api/userStocks`).then(res => {
      const userStocks = res.data
      this.socket = require('socket.io-client')(
        'https://ws-api.iextrading.com/1.0/last'
      )
      let socket = this.socket
      socket.on('message', data => {
        try {
          data = JSON.parse(data)
          let last = Math.ceil(data.price * 100) / 100
          const state = {...this.state[data.symbol], last}
          this.setState({[data.symbol]: state})
        } catch (e) {
          console.error(e)
        }
      })
      socket.on('connect', () => {
        userStocks.forEach(stock => socket.emit('subscribe', stock.symbol))
      })

      let state = {}
      Promise.all(
        userStocks.map(stock => {
          state[stock.symbol] = {quantity: stock.quantity, sellQuantity: 0}
          return axios
            .get(`https://api.iextrading.com/1.0/stock/${stock.symbol}/ohlc`)
            .then(({data}) => {
              state[stock.symbol].open = data.open.price
              state[stock.symbol].last = data.close.price
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

  sell = quantity => {
    console.log(quantity)
    // const symbol = this.props.symbol.toUpperCase()
    // const price = this.state.stock.last * 100
    // axios.post('/api/transactions', {
    //   symbol,
    //   price,
    //   quantity
    // })
    // axios.put('/api/userStocks', {symbol, quantity})
    // this.props.updateBalance(price * quantity)
    // this.setState({quantity: 0})
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <div>
        <ul>
          {Object.keys(this.state).map((symbol, i) => {
            const sellQuantity = this.state[symbol].sellQuantity
            const quantity = this.state[symbol].quantity
            return (
              <li key={i}>
                ({symbol}) {Math.abs(this.state[symbol].quantity)} Shares @ ${(
                  this.state[symbol].last || 0
                ).toFixed(2)}
                <input
                  type="text"
                  pattern="[0-9]*"
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
                  onClick={() => this.sell(sellQuantity)}
                >
                  Sell
                </button>
              </li>
            )
          })}
        </ul>
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
