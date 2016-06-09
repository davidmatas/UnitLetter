class Drag {
  constructor (el, holder) {
    this.holders = Array.from(document.querySelectorAll(holder)).map(item => (
      {
        el: item,
        coords: item.getBoundingClientRect()
      }
    ))

    this.moving = this.createMoving.bind(this);
    this.unmoving = this.deleteMoving.bind(this);

    touch(document, 'add', 'mousedown', (e) => {
      if (e.which > 1) return;
      this.target = e.target;
      this.posOrigin = getPositionEvent(e);
      if (this.target.matches(el)) {
        this.addEvents();
      }
    })
  }
  addEvents () {
    touch(document, 'add', 'mousemove', this.moving);
    touch(document, 'add', 'mouseup', this.unmoving);
  }
  removeEvents () {
    touch(document, 'remove', 'mousemove', this.moving);
    touch(document, 'remove', 'mouseup', this.unmoving);
  }
  moveTarget (event) {
    let origin = this.posOrigin;
    let posEvent = getPositionEvent(event);
    this.target.style.transform = `translate(${posEvent.clientX - origin.clientX}px, ${posEvent.clientY - origin.clientY}px)`;
  }
  createMoving (e) {
    e.preventDefault();
    this.moveTarget(e);
  }
  deleteMoving (e) {
    let ePos = getPositionEvent(e);
    let holder = this.holders.reduce((prev, item) => {
      if ((item.coords.left <= ePos.clientX ) && ( ePos.clientX <= item.coords.right) && (item.coords.top <= ePos.clientY) && (ePos.clientY <= item.coords.bottom)) {
        prev = item.el;
      }
      return prev;
    }, null);

    if(holder) {
      holder.appendChild(this.target);
    }

    this.target.style.transform = 'translate(0, 0)';
    this.removeEvents();
  }
}

// Helper functions for Drag class

function getPositionEvent(e) {
  let {clientX, clientY} = e.touches ? e.touches[0] || e.changedTouches[0] : e;
  return {clientX, clientY};
}

function touch(el, op, type, fn) {
  var touch = {
    mouseup: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove'
  };

  if (op === 'add') {
    el.addEventListener(touch[type], fn)
    el.addEventListener(type, fn)
  } else {
    el.removeEventListener(touch[type], fn)
    el.removeEventListener(type, fn)
  }
}

export default Drag;
