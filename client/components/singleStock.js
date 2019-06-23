import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleStock} from '../store'

class SingleStock extends React.Component {
  componentDidMount() {
    const symbol = this.props.match.params.symbol
    this.props.fetchSingleStock(symbol)
  }

  render() {
    const {stock} = this.props
    console.log(stock, stock.open)
    return (
      <div>
        open: {stock.open} {'\t'}
        high: {stock.high + '\t'}
        low: {stock.low + '\t'}
        close: {stock.close + '\t'}
        <br />
        current: {stock.current + '\t'}
        <button onClick={() => {}}>Buy</button>
      </div>
    )
  }
}
const mapState = state => ({
  stock: state.stock.single
})

const mapDispatch = dispatch => ({
  fetchSingleStock: symbol => {
    dispatch(fetchSingleStock(symbol))
  }
})

export default connect(mapState, mapDispatch)(SingleStock)
