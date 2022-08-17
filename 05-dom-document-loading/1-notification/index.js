export default class NotificationMessage {
  static activeNotification;

  timeout;

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

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  millisecondsToSeconds(milliseconds) {
    return milliseconds / 1000;
  }

  show(parent = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    parent.append(this.element);

    this.timeout = setTimeout(() => this.remove(), this.duration);

    NotificationMessage.activeNotification = this;
  }

  remove() {
    clearTimeout(this.timeout);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
