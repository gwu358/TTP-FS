import React from 'react'
import {connect} from 'react-redux'
import {updateBalance} from '../store'
import axios from 'axios'

class SingleStock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: 0,
      stock: {}
    }
  }

  fetchData() {
    this.socket = require('socket.io-client')(
      'https://ws-api.iextrading.com/1.0/last'
    )
    let socket = this.socket
    socket.on('message', data => {
      try {
        let last = Math.ceil(JSON.parse(data).price * 100) / 100
        const state = {...this.state, stock: {...this.state.stock, last}}
        this.setState(state)
      } catch (e) {
        console.error(e)
      }
    })
    socket.on('connect', () => {
      socket.emit('subscribe', this.props.symbol)
    })

    axios
      .all([
        axios.get(
          `https://api.iextrading.com/1.0/stock/${this.props.symbol}/ohlc`
        ),
        axios.get(
          `https://api.iextrading.com/1.0/tops/last?symbols=${
            this.props.symbol
          }`
        )
      ])
      .then(
        axios.spread((ohlcRes, lastRes) => {
          // do something with both responses
          let stock = {}
          if (ohlcRes.data) {
            stock = ohlcRes.data
            stock.open = stock.open.price
            stock.close = stock.close.price
          }
          if (lastRes.data)
            stock.last = Math.ceil(lastRes.data.price * 100) / 100
          else stock.last = Math.ceil(stock.close * 100) / 100
          this.setState({stock})
        })
      )
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.symbol !== prevProps.symbol) {
      this.fetchData()
    }
  }

  componentWillUnmount() {
    this.socket.emit('unsubscribe', this.props.symbol)
  }

  verifyQuantity(quantity) {
    const balance = this.props.balance / 100
    if (quantity * this.state.stock.last > balance)
      quantity = Math.trunc(balance / this.state.stock.last)
    return quantity
  }

  IncrementItem = () => {
    const quantity = this.verifyQuantity(this.state.quantity + 1)
    this.setState({quantity})
  }

  DecreaseItem = () => {
    this.setState({quantity: this.state.quantity - 1})
  }

  editQuantity = event => {
    let quantity = this.verifyQuantity(
      Number(
        event.target.validity.valid ? event.target.value : this.state.quantity
      )
    )
    this.setState({quantity})
  }

  buy = quantity => {
    const symbol = this.props.symbol.toUpperCase()
    const price = this.state.stock.last * 100
    console.log({symbol, price: this.state.stock.last * 100, quantity})
    axios.post('/api/transactions', {
      symbol,
      price,
      quantity
    })
    axios.put('/api/userStocks', {symbol, quantity})
    this.props.updateBalance(price * quantity)
    this.setState({quantity: 0})
  }

  render() {
    const {stock, quantity} = this.state
    const {symbol, name, balance} = this.props
    let totalInCent = stock.last * 100 * quantity
    return (
      <div>
        <p>
          {name} ({symbol})
        </p>
        open: {stock.open} {'\t'}
        high: {stock.high + '\t'}
        low: {stock.low + '\t'}
        close: {stock.close + '\t'}
        <br />
        latest: {stock.last + '\t'}
        <br />
        <input
          type="text"
          pattern="[0-9]*"
          value={quantity}
          onChange={this.editQuantity}
        />
        <button onClick={this.IncrementItem}>↑</button>
        <button disabled={!quantity} onClick={this.DecreaseItem}>
          ↓
        </button>
        <button disabled={!quantity} onClick={() => this.buy(quantity)}>
          Buy
        </button>
        <div>
          Total: $ {(totalInCent / 100).toFixed(2)} <br />
          Remaining: $ {((balance - totalInCent) / 100).toFixed(2)}
        </div>
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

export default connect(mapState, mapDispatch)(SingleStock)
