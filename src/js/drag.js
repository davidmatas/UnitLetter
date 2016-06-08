class Drag {
  constructor (el) {
    touch(document, 'add', 'mousedown', (e) => {
      this.target = e.target;
      this.posOrigin = getPositionEvent(e);
      this.moving = this.createMoving.bind(this);
      this.unmoving = this.deleteMoving.bind(this);

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
    touch(document, 'remove', 'mousemove', this.moving)
    touch(document, 'remove', 'mouseup', this.unmoving)
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
    if(!e.target.matches('.dest-opt')) {
      this.target.style.transform = 'translate(0, 0)';
    }
    this.removeEvents()
  }
}

// Helper functions for Drag class

function getPositionEvent(e) {
  let {clientX, clientY} = e.touches ? e.touches[0] : e;
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
