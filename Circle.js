function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


export default class Circle {
  constructor(config) {
    this.el = document.createElementNS(config.xmlns, 'circle');
    this.el.setAttribute('r', '50');

    this.cx = config.cx;
    this.cy = config.cy;
    this.fill = getRandomColor();

    this._makeMovable(this.el);
  }

  _makeMovable() {
    this.el.addEventListener('mousedown', event => {
      const shiftX = event.pageX - this.cx;
      const shiftY = event.pageY - this.cy;

      const onMouseMove = event => {
        this.cx = event.pageX - shiftX;
        this.cy = event.pageY - shiftY;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        this.el.dispatchEvent(new CustomEvent('circle-move', {
          detail: { circle: this },
          bubbles: true,
          composed: true,
        }));
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  get cx() {
    return this.el.getAttribute('cx');
  }

  set cx(val) {
    this.el.setAttribute('cx', val);
  }

  get cy() {
    return this.el.getAttribute('cy');
  }

  set cy(val) {
    this.el.setAttribute('cy', val);
  }

  get fill() {
    return this.el.getAttribute('fill');
  }

  set fill(val) {
    this.el.setAttribute('fill', val);
  }
}
