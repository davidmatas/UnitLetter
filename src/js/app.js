import React from 'react'
import ReactDOM from 'react-dom'
import UnitLetters from '../components/UnitLetters'
import units from './data'
import '../scss/style.scss'

class Exercise extends React.Component {
  render() {
    return (
      <UnitLetters units={units} container="cardHolder" />
    )
  }
}

ReactDOM.render(<Exercise />, document.getElementById('app'))
