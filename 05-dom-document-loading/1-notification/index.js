export default class NotificationMessage {
  constructor(
    message = '',
    {
      duration = 1000,
      type = ''
    } = {}) {

    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  getTemplate() {
    return `
        <div class="notification ${this.type}" style="--value:${this.millisecondsToSeconds(this.duration)}s" data-element="notification">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        </div>
        `;
  }

  render(elem) {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    document.body.append(this.element);
  }

  millisecondsToSeconds(milliseconds) {
    return milliseconds / 1000;
  }

  show() {
    const notificationElements = document.querySelectorAll('[data-element="notification"]');

    if (notificationElements.length > 1) {
      notificationElements[0].remove();
    }

    setTimeout(() => this.destroy(), this.duration);
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
