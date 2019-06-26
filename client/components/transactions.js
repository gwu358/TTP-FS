import React from 'react'
import axios from 'axios'

export default class Transactions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    axios.get('/api/transactions').then(({data}) => {
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
              <th>Date & time</th>
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
                  <td>{formatDate(new Date(tran.updatedAt))}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }
}

function formatDate(date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return (
    date.getMonth() +
    1 +
    '/' +
    date.getDate() +
    '/' +
    date.getFullYear() +
    '  ' +
    strTime
  )
}
