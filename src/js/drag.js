class Drag {
  constructor (options) {
    Object.assign(this, options);
    this.moving   = this.createMoving.bind(this);
    this.unmoving = this.deleteMoving.bind(this);
    this.start    = this.init.bind(this);
    this.holders  = Array.from(document.querySelectorAll(this.holder.join(', '))).map(item => (
      {
        el: item,
        coords: item.getBoundingClientRect()
      }
    ));
    this.last;
    this.target;
    this.posOrigin;

    touch(document, 'add', 'mousedown', this.start)
  }
  init (e) {
    if (e.which > 1) return;
    if (e.target.matches(this.el)) {
      let ePos = getPositionEvent(e);
      this.holders = this.holders.map((item) => {
        if (eventInsideArea(ePos, item.coords)) item.origin = true;
        return item;
      });
      this.target = e.target;
      this.posOrigin = getPositionEvent(e);
      this.addEvents();
    }
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
    let holder = this.holders.filter(item => {
      if (item.origin) item.origin = false
      else {
        return eventInsideArea(ePos, item.coords)
      }
    });

    if(holder.length > 0) {
      holder[0].el.appendChild(this.target);
      this.last = {
        el: this.target,
        cont: holder[0].el
      }
      this.callback();
    }

    this.target.style.transform = 'translate(0, 0)';
    this.removeEvents();
  }
  destroy() {
    touch(document, 'remove', 'mousedown', this.start);
  }
}

// Helper functions for Drag class

function eventInsideArea(e, area) {
  return (area.left <= e.clientX ) && ( e.clientX <= area.right) && (area.top <= e.clientY) && (e.clientY <= area.bottom)
}

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
