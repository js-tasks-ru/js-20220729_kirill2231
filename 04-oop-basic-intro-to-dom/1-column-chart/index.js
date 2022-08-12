export default class ColumnChart {

  constructor(props = {}) {
    this.render();
    this.initEventListeners();

    this.chartHeight = Number(this.element.style.getPropertyValue('--chart-height'));

    if (Object.keys(props).length === 0) {
      this.element.classList.add('column-chart_loading');
      return this;
    }

    const {data, label, value, link, formatHeading} = props;
    const columnTitle = this.element.querySelector('.column-chart__title');
    const columnValue = this.element.querySelector('.column-chart__header');

    if (label !== undefined) {
      const columnTitle = this.element.querySelector('.column-chart__title');
      columnTitle.innerHTML = `${label}`;
    }

    if (link !== undefined) {
      const columnLink = document.createElement('a')
      columnLink.classList.add('column-chart__link');
      columnLink.href = link;
      columnLink.innerHTML = 'Подробнее';
      columnTitle.append(columnLink);
    }

    if (value !== undefined) {
      columnValue.innerHTML = `${value}`;
    }

    if (formatHeading !== undefined) {
      columnValue.innerHTML = formatHeading(value);
    }

    if (data !== undefined) {
      this.update(data);
    }

  }

  getTemplate() {
    return `
        <div class="column-chart" style="--chart-height: 50">
            <div class="column-chart__title">
            </div>
            <div class="column-chart__container">
              <div data-element="header" class="column-chart__header">Header</div>
              <div data-element="body" class="column-chart__chart">
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

  initEventListeners() { // добавляем обработчики событий

  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  update(data) {
    const columnChart = this.element.querySelector('.column-chart__chart');
    const columnProps = this.getColumnProps(data);

    if (columnProps.length !== 0) {
      columnProps.forEach((item, index) => {
        const div = document.createElement('div');
        div.style.setProperty('--value', `${columnProps[index].value}`);
        div.dataset.tooltip = `${columnProps[index].percent}`;
        columnChart.append(div);
      });
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() { // удаляем обработчики событий
    this.remove();
  }
}
