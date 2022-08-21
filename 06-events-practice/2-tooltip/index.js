export default class Tooltip {

  onPointerover = event => {
    const element = event.target.closest('[data-tooltip]');

    if (element) {
      this.render(element.dataset.tooltip);

      document.addEventListener('pointermove', this.onPointermove);
    }
  };

  onPointermove = event => {
    this.moveTooltip(event);
  };

  onPointerout = () => {
    document.removeEventListener('pointermove', this.onPointermove);

    this.remove();
  };

  initEventListeners () {
    document.addEventListener('pointerover', this.onPointerover);
    document.addEventListener('pointerout', this.onPointerout);
  }

  initialize() {
    this.initEventListeners();
  }


  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  getTemplate(param) {
    return `
      <div class="tooltip">${param}</div>
    `;
  }

  render(param) {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate(param);
    this.element = element.firstElementChild;

    document.body.append(this.element);
  }

  moveTooltip(event) {
    const shift = 10;
    const left = event.clientX + shift;
    const top = event.clientY + shift;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.onPointerover);
    document.removeEventListener('pointermove', this.onPointermove);
    document.removeEventListener('pointerout', this.onPointerout);
    this.remove();
    this.element = null;
  }
}


