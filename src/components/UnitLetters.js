import React from 'react'
import Drag from '../js/drag'
import Holder from '../components/holder'
import Card from '../components/card'

class UnitLetters extends React.Component {

  constructor(props) {
    super()
    this.valids          = []
    this.item            = 'card'
    this.selectorWin     = 'win'
    this.itemsContainer  = '#' + props.container
    this.optionsSelector = '.dest-holder'
    this.itemExent       = `.${this.item}:not(.${this.selectorWin})`
    this.state = {
      unit: 0,
      units: props.units
    }
  }

  componentDidMount() {
    this.drag  = this.instanceDrag()
    this.containerEl = document.getElementById(this.itemsContainer);
    this.containerChildren = this.containerEl.children;
  }

  exercise () {
    let {cont, el} = this.drag.last;
    let reg = new RegExp(cont.dataset.exercise, 'i');

    this.valids = this.valids.filter(item => item !== el)

    if (reg.test(el.innerText)) this.valids.push(el);
    if (this.containerChildren.length === 0) this.finish();
  }

  instanceDrag () {
    return new Drag({
      el: this.itemExent,
      holder: [this.optionsSelector, this.itemsContainer],
      callback: this.exercise.bind(this)
    });
  }

  componentDidUpdate () {
    this.reset()
  }

  reset() {
    this.drag = this.instanceDrag()
    this.valids = [];
  }

  restoreItems () {
    Array.from(document.getElementsByClassName(this.item)).forEach(item => {
      item.classList.remove(this.selectorWin);
      this.containerEl.appendChild(item);
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
      this.containerEl.appendChild(item);
    })
    this.reset()
  }

  tryAgain () {
    let failed = document.querySelectorAll(this.itemExent)
    if (failed.length > 0) {
      this.restoreFailed(failed)
    } else {
      let greenMark = document.querySelector('.green-mark');
      greenMark.style.display = 'flex';

      let hideGreenMark = setTimeout(() => {
        greenMark.style.display = 'none'
        this.nextLesson()
        clearTimeout(hideGreenMark)
      }, 1500)
    }
  }

  finish () {
    this.drag.destroy();
    if (this.valids.length > 0) {
      let intervalNum = 0;
      let interval = setInterval(() => {
        this.valids[intervalNum].classList.add('win')
        intervalNum++
        if (intervalNum === this.valids.length) {
          clearInterval(interval)
          this.tryAgain()
        }
      }, 500)
    } else {
      this.tryAgain();
    }
  }

  render() {
    let {unit, units} = this.state;
    let cards = units[unit].cards.map((item, index) =>
      <Card selector={this.item} name={item} key={index} />
    )
    return (
      <div>
        <div className="dest">
          <Holder letter={units[unit].letter} rule={`^${units[unit].letter}`} />
          <Holder letter={units[unit].letter} rule={`^[^${units[unit].letter}]`} />
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
