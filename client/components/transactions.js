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
      <div className="columns is-centered">
        <table className="table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Symbol</th>
              <th>Share(s)</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {this.state.transactions &&
              this.state.transactions.map((tran, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor:
                      tran.quantity > 0 ? 'Lavender' : 'LightGoldenRodYellow'
                  }}
                >
                  <td>{tran.quantity > 0 ? 'BUY' : 'SELL'}</td>
                  <td>{tran.symbol}</td>
                  <td>{Math.abs(tran.quantity)}</td>
                  <td>{(tran.price / 100).toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }
}
