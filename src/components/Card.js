import React from 'react'

class Card extends React.Component {
  render() {
    return <div className={this.props.selector}>{this.props.name}</div>
  }
}

export default Card
