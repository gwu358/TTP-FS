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
    return <div />
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
