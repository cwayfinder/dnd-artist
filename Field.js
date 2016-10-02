import Circle from './Circle';

function getRandomNumber(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

function getDistance(circle1, circle2) {
  const x = Math.abs(circle1.cx - circle2.cx);
  const y = Math.abs(circle1.cy - circle2.cy);

  return Math.sqrt(x * x + y * y);
}

function avg(num1, num2) {
  return Math.floor((Number(num1) + Number(num2)) / 2);
}

function mergeColors(color1, color2) {
  const split = color => {
    const hex = color.substring(1);

    const red = hex.substring(0, 2);
    const green = hex.substring(2, 4);
    const blue = hex.substring(4, 6);

    return [red, green, blue]
      .map(light => Number('0x' + light));
  };

  const tuple1 = split(color1);
  const tuple2 = split(color2);

  const result = [0, 1, 2]
    .map(index => avg(tuple1[index], tuple2[index]))
    .map(light => light.toString(16))
    .join('');

  return '#' + result;
}


const xmlns = 'http://www.w3.org/2000/svg';


export default class Field {
  constructor(config) {
    this.node = config.node;
    this.circleRadius = config.circleRadius;

    this.field = document.createElementNS(xmlns, "svg");
    this.field.id = 'field';

    this.circles = [];

    this.addSomeCircles();

    this.bindEvents();

    this.node.appendChild(this.field)
  }

  addSomeCircles() {
    while (this.circles.length < 10) {
      const cx = getRandomNumber(this.circleRadius, this.node.offsetWidth - this.circleRadius);
      const cy = getRandomNumber(this.circleRadius, this.node.offsetHeight - this.circleRadius);

      this.addCircle(cx, cy);
    }
  }

  addCircle(cx, cy) {
    if (this.enoughSpace(cx, cy)) {
      const circle = new Circle({ cx, cy, xmlns });
      this.field.appendChild(circle.el);
      this.circles.push(circle);
    }
  }

  removeCircle(circle) {
    this.field.removeChild(circle.el);

    const index = this.circles.indexOf(circle);
    this.circles.splice(index, 1);
  }

  enoughSpace(cx, cy) {
    const diameter = this.circleRadius * 2;

    return this.circles.every(circle => {
      const x = Math.abs(circle.cx - cx);
      const y = Math.abs(circle.cy - cy);

      return x * x + y * y >= (diameter * diameter);
    });
  }

  bindEvents() {
    this.node.addEventListener('dblclick', e => {
      if (e.target.nodeName === 'circle') {
        this.field.removeChild(e.target);
      } else {
        this.addCircle(e.pageX, e.pageY);
      }
    });

    this.node.addEventListener('circle-move', e => {
      const target = e.detail.circle;
      const others = this.circles.filter(circle => circle !== target);

      const closest = others.reduce((res, circle) => {
        const prevDistance = getDistance(res, target);
        const currDistance = getDistance(circle, target);
        return prevDistance > currDistance ? circle : res;
      }, others[0]);

      if (getDistance(target, closest) < this.circleRadius / 2) {
        target.fill = mergeColors(closest.fill, target.fill);
        target.cx = avg(target.cx, closest.cx);
        target.cy = avg(target.cy, closest.cy);

        this.removeCircle(closest);
      }
    });
  }
}
