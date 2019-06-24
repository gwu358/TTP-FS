import React from 'react'
import {connect} from 'react-redux'
// import {fetchSingleStock} from '../store'
import axios from 'axios'

class SingleStock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: 0,
      stock: {}
    }
    // this.editQuantity = this.editQuantity.bind(this);
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

  componentDidMount() {
    const symbol = this.props.match.params.symbol
    // this.props.fetchSingleStock(symbol)
    axios
      .get(`https://api.iextrading.com/1.0/stock/${symbol}/ohlc`)
      .then(res => {
        let stock
        if (res.data) {
          stock = res.data
          stock.open = stock.open.price
          stock.close = stock.close.price
          stock.current = stock.close
        } else stock = {}
        this.setState({stock})
      })
  }

  render() {
    const {stock} = this.state
    const {buy} = this.props
    return (
      <div>
        open: {stock.open} {'\t'}
        high: {stock.high + '\t'}
        low: {stock.low + '\t'}
        close: {stock.close + '\t'}
        <br />
        current: {stock.current + '\t'}
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
        <button onClick={() => buy(this.state.quantity)}>Buy</button>
      </div>
    )
  }
}
const mapState = state => ({
  stock: state.stock.single
})

const mapDispatch = (dispatch, props) => ({
  buy: quantity => {
    const symbol = props.match.params.symbol.toUpperCase()
    console.log(symbol, quantity)
  }
})

export default connect(mapState, mapDispatch)(SingleStock)
