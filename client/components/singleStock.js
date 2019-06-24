import React from 'react'
import {connect} from 'react-redux'
import {updateBalance} from '../store'
import axios from 'axios'

class SingleStock extends React.Component {
  constructor(props) {
    super(props)
    this.symbol = props.match.params.symbol
    this.state = {
      quantity: 0,
      stock: {}
    }
  }

  componentDidMount() {
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
      socket.emit('subscribe', this.symbol)
    })

    // axios
    //   .get(`https://api.iextrading.com/1.0/stock/${this.symbol}/ohlc`)
    //   .then(res => {
    //     let stock;
    //     if (res.data) {
    //       stock = res.data;
    //       stock.open = stock.open.price
    //       stock.close = stock.close.price
    //       stock.last = stock.close
    //     } else stock = {}
    //     this.setState({stock})
    //   })
    // axios.get(`https://api.iextrading.com/1.0/tops/last?symbols=${this.symbol}`)

    axios
      .all([
        axios.get(`https://api.iextrading.com/1.0/stock/${this.symbol}/ohlc`),
        axios.get(
          `https://api.iextrading.com/1.0/tops/last?symbols=${this.symbol}`
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

  componentWillUnmount() {
    this.socket.emit('unsubscribe', this.symbol)
  }

  IncrementItem = () => {
    this.setState({quantity: this.state.quantity + 1})
  }

  DecreaseItem = () => {
    this.setState({quantity: this.state.quantity - 1})
  }

  editQuantity = event => {
    let quantity = Number(
      event.target.validity.valid ? event.target.value : this.state.quantity
    )
    this.setState({quantity})
  }

  buy = quantity => {
    const symbol = this.symbol.toUpperCase()
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
    const {stock} = this.state
    return (
      <div>
        open: {stock.open} {'\t'}
        high: {stock.high + '\t'}
        low: {stock.low + '\t'}
        close: {stock.close + '\t'}
        <br />
        last: {stock.last + '\t'}
        <br />
        <input
          type="text"
          pattern="[0-9]*"
          value={this.state.quantity}
          onChange={this.editQuantity}
        />
        <button onClick={this.IncrementItem}>↑</button>
        <button disabled={!this.state.quantity} onClick={this.DecreaseItem}>
          ↓
        </button>
        <button
          disabled={!this.state.quantity}
          onClick={() => this.buy(this.state.quantity)}
        >
          Buy
        </button>
      </div>
    )
  }
}
// const mapState = state => ({
//   stock: state.stock.single
// })

const mapDispatch = dispatch => {
  return {
    updateBalance(total) {
      dispatch(updateBalance(total))
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default connect(null, mapDispatch)(SingleStock)
