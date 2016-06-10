import React from 'react'

class Holder extends React.Component {
  render() {
    return (
      <div className="dest-opt">
        <div className="dest-opt-header">{this.props.letter}</div>
        <div className="dest-holder" data-exercise={this.props.rule}></div>
      </div>
    )
  }
}

export default Holder
