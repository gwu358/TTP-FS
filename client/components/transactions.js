import React from 'react'
import axios from 'axios'

export default class Transactions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    axios.get(`/api/transactions`).then(({data}) => {
      this.setState({transactions: data})
    })
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.transactions &&
            this.state.transactions.map((tran, i) => (
              <li key={i}>
                {tran.quantity > 0 ? 'BUY' : 'SELL'} ({tran.symbol}){' '}
                {Math.abs(tran.quantity)} Shares @ ${(tran.price / 100).toFixed(
                  2
                )}
              </li>
            ))}
        </ul>
      </div>
    )
  }
}
