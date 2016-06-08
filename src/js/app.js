function moveCard(target, origin, event) {
  let posEvent = getPositionEvent(event);
  target.style.transform = `translate(${posEvent.clientX - origin.clientX}px, ${posEvent.clientY - origin.clientY}px)`;
}

function getPositionEvent(e) {
  let {clientX, clientY} = e.touches ? e.touches[0] : e;
  return {clientX, clientY};
}

function createMoving(downEvent) {
  let posOrigin = getPositionEvent(downEvent);
  return (event) => {
    event.preventDefault();
    moveCard(downEvent.target, posOrigin, event);
  }
}

function touchy(el, op, type, fn) {
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


function deleteMoving(downEvent, moving) {
  let card = downEvent.target;
  return function endMovingAndMouseUp(e) {
    console.log(e);
    if(!e.target.matches('.dest-opt')) {
      card.style.transform = 'translate(0, 0)';
    }

    touchy(this, 'remove', 'mousemove', moving)
    touchy(this, 'remove', 'mouseup', endMovingAndMouseUp)

    // this.removeEventListener('mousemove', moving);
    // this.removeEventListener('mouseup', endMovingAndMouseUp)
  }
}

touchy(document, 'add', 'mousedown', function(e) {
  var target = e.target;
  var moving = createMoving(e);
  var unmoving = deleteMoving(e, moving);

  if (target.matches('.card')) {
    touchy(this, 'add', 'mousemove', moving);
    touchy(this, 'add', 'mouseup', unmoving);

    // this.addEventListener('mousemove', moving);
    // this.addEventListener('mouseup', unmoving)
  }
})
// document.addEventListener('mousedown', )

