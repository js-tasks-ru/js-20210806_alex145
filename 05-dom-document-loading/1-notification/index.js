export default class NotificationMessage {

  element;

  constructor(
    message = '', {
      duration = 20000,
      type = 'success',
    } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.removeAllNotifications();
    this.render();
  }

  get template() {
    return `<div class="notification ${this.type}" style="--value:${this.duration / 100}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>`;
  }

  show(target = null) {
    setTimeout(() => {
      this.remove();
    }, this.duration);

    if (target) {
      target.prepend(this.element);
    } else {
      document.body.prepend(this.element);
    }
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  removeAllNotifications() {
    document.querySelectorAll('.notification').forEach(item => {
      item.remove();
    });
  }

  destroy() {
    this.element.remove();
  }

  remove() {
    this.element.remove();
  }

}
