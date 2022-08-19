export default class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize () {
    let mouseX;
    let mouseY;

    const container = document.querySelector('[data-tooltip]');

    const pointerover = new MouseEvent('pointerover', {
      bubbles: true
    });

    const pointermove = new MouseEvent('pointerout', {
      bubbles: true
    });

    document.addEventListener('mousemove', (event) => {
      mouseX = event.pageX,
      mouseY = event.pageY;
    });

    container.addEventListener('pointermove', () => {
      this.element.style.top = `${mouseY}px`;
      this.element.style.left = `${mouseX}px`;
    });

    container.addEventListener('pointerover', (event) => {
      this.render(event.target.dataset.tooltip);

      this.element.style.top = `${mouseY}px`;
      this.element.style.left = `${mouseX}px`;
    });

    container.addEventListener('pointerout', () => {
      this.remove();
    });
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

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}


