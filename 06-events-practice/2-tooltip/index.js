export default class Tooltip {

  element;
  static instance;

  pointerOver = (event) => {
    const element = event.target.closest('[data-tooltip]');
    if (element) {
      this.render(element.dataset.tooltip);
      document.addEventListener('pointermove', this.pointerMove);
    }
  };

  pointerMove = (event) => {
    const offset = 10;

    this.element.style.left = `${event.clientX + offset}px`;
    this.element.style.top = `${event.clientY + offset}px`;
  };

  pointerOut = () => {
    document.removeEventListener('pointermove', this.pointerMove);
    this.remove();
  }

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }
    return Tooltip.instance;
  }

  initialize() {
    document.body.addEventListener('pointerover', this.pointerOver);
    document.body.addEventListener('pointerout', this.pointerOut);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.pointerOver);
    document.removeEventListener('pointerout', this.pointerOut);
    document.removeEventListener('pointermove', this.pointerMove);
    this.remove();
    this.element = null;
    Tooltip.instance = null;
  }

  render(html) {
    this.element = document.createElement('div');
    this.element.innerHTML = html;
    this.element.className = 'tooltip';
    document.body.append(this.element);
  }
}
