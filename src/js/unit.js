import Drag from './drag';

class UnitLetters  {
  constructor (itemsContainer) {
    this.itemsContainer = itemsContainer;
    this.items          = document.querySelector(itemsContainer).children;
    this.drag           = this.instanceDrag();
    this.valids         = [];
  }
  exercise () {
    let {cont, el} = this.drag.last;
    let reg        = new RegExp(cont.dataset.exercise, 'i');

    if (reg.test(el.innerText)) this.valids.push(el);
    if (this.items.length === 0) this.finish();
  }
  instanceDrag () {
    return new Drag('.card:not(.win)', ['.dest-holder', this.itemsContainer], this.exercise.bind(this));
  }
  tryAgain () {
    Array.from(document.querySelectorAll('.card:not(.win)')).forEach((item) => {
      document.querySelector(this.itemsContainer).appendChild(item);
    })
    this.valids = [];
    this.drag = this.instanceDrag();
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
}

export default UnitLetters;
