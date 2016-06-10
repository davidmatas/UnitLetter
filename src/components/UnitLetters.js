import React from 'react'
import ReactDOM from 'react-dom'
import Drag from '../js/drag'
import Holder from '../components/holder'
import Card from '../components/card'

class UnitLetters extends React.Component {

  constructor(props) {
    super()
    this.valids          = []
    this.itemsContainer  = props.container
    this.item            = 'card'
    this.selectorWin     = 'win'
    this.optionsSelector = 'dest-holder'
    this.itemExent       = `.${this.item}:not(.${this.selectorWin})`
    this.state = {
      unit: 0,
      units: props.units
    }
  }

  componentDidMount() {
    this.containerEl = document.getElementById(this.itemsContainer)
    this.containerChildren = this.containerEl.children
    this.holders = [
      ReactDOM.findDOMNode(this.refs['start']).getElementsByClassName(this.optionsSelector)[0],
      ReactDOM.findDOMNode(this.refs['dontStart']).getElementsByClassName(this.optionsSelector)[0]
    ]
    this.drag  = this.instanceDrag()
  }

  exercise () {
    let {cont, el} = this.drag.last
    let reg = new RegExp(cont.dataset.exercise, 'i')

    this.valids = this.valids.filter(item => item !== el)

    if (reg.test(el.innerText)) this.valids.push(el)
    if (this.containerChildren.length === 0) this.finish()
  }

  instanceDrag () {
    return new Drag({
      el: this.itemExent,
      holders: [].concat(this.holders, this.containerEl),
      callback: this.exercise.bind(this)
    });
  }

  componentDidUpdate () {
    this.reset()
  }

  reset() {
    this.drag.destroy()
    this.drag = this.instanceDrag()
    this.valids = []
  }

  restoreItems () {
    Array.from(document.getElementsByClassName(this.item)).forEach(item => {
      item.classList.remove(this.selectorWin)
      this.containerEl.appendChild(item)
    })
  }

  nextLesson() {
    this.restoreItems()
    this.setState({
      unit: this.state.unit >= this.state.units.length - 1 ? 0 : ++this.state.unit,
      units: this.state.units
    })
  }

  restoreFailed(failed) {
    Array.from(failed).forEach((item) => {
      this.containerEl.appendChild(item)
    })
    this.reset()
  }

  tryAgain () {
    let failed = document.querySelectorAll(this.itemExent)
    if (failed.length > 0) {
      this.restoreFailed(failed)
    } else {
      this.goodJob()
    }
  }

  goodJob() {
    let greenMark = document.querySelector('.green-mark')
    greenMark.style.display = 'flex'

    let hideGreenMark = setTimeout(() => {
      greenMark.style.display = 'none'
      this.nextLesson()
      clearTimeout(hideGreenMark)
    }, 1500)
  }

  evaluateValids() {
    let intervalNum = 0
    let interval = setInterval(() => {
      this.valids[intervalNum].classList.add('win')
      intervalNum++
      if (intervalNum === this.valids.length) {
        clearInterval(interval)
        this.tryAgain()
      }
    }, 500)
  }

  finish () {
    this.drag.destroy()
    if (this.valids.length > 0) {
      this.evaluateValids()
    } else {
      this.tryAgain()
    }
  }

  render() {
    let {unit, units} = this.state
    let cards = units[unit].cards.map((item, index) =>
      <Card selector={this.item} name={item} key={index} />
    )
    return (
      <div>
        <div className="dest">
          <Holder ref="start" letter={units[unit].letter} rule={`^${units[unit].letter}`} />
          <Holder ref="dontStart" letter={units[unit].letter} rule={`^[^${units[unit].letter}]`} />
        </div>
        <div id={this.itemsContainer} className="card-holder">
          {cards}
        </div>
        <div className="green-mark">✅</div>
      </div>
    )
  }
}

export default UnitLetters
