export default class ColumnChart {
  chartHeight = 50;

  constructor(
    {
      data = [],
      label = '',
      value = 0,
      link = '',
      formatHeading = data => data
    }
    = {}) {

    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
  }

  getTemplate() {
    return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
            ${this.label}
            ${this.getLink()}
            </div>
            <div class="column-chart__container">
              <div class="column-chart__header">${this.value}</div>
              <div class="column-chart__chart">
                ${this.getColumnChart(this.data)}
              </div>
            </div>
      </div>
        `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }
  }

  getColumnChart(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    const columnProps = data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });

    return columnProps.map(item => {
      return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`;
    })
    .join("");
  }

  getLink() {
    return this.link ?
      `<a class="column-chart__link" href="${this.link}">Подробнее</a>`
      : "";
  }

  update(data) {
    const columnChart = this.element.querySelector('.column-chart__chart');

    this.data = data;

    columnChart.innerHTML = this.getColumnChart(data);
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
