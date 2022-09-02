import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    element;
    chartHeight = 50;
    subElements = {};

    constructor(
      {
        url = '',
        range = {
          from: new Date(),
          to: new Date()
        },
        label = '',
        link = '',
        formatHeading = data => data
      }
      = {}) {

      this.url = new URL(url, BACKEND_URL);
      this.range = range;
      this.label = label;
      this.link = link;
      this.formatHeading = formatHeading;

      this.render();
      this.update(this.range.from, this.range.to);
    }

    getTemplate() {
      return `
          <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
              <div class="column-chart__title">
              ${this.label}
              ${this.getLink()}
              </div>
              <div class="column-chart__container">
                <div class="column-chart__header" data-element="header"></div>
                <div class="column-chart__chart" data-element="body"></div>
              </div>
        </div>
          `;
    }

    render() {
      const element = document.createElement('div');
      element.innerHTML = this.getTemplate();

      this.element = element.firstElementChild;

      this.subElements = this.getSubElements();
    }

    async getServerData(from, to) {
      this.url.searchParams.set('from', from.toISOString());
      this.url.searchParams.set('to', to.toISOString());

      return await fetchJson(this.url);
    }

    getSubElements() {
      const result = {};
      const elements = this.element.querySelectorAll('[data-element]');

      elements.forEach(subElement => {
        const name = subElement.dataset.element;
        result[name] = subElement;
      });

      return result;
    }

    setHeaderValue(data) {
      this.subElements.header.innerHTML = this.formatHeading(
        Object.values(data).reduce((previousValue, value) => previousValue += value, 0)
      );
    }

    setColumnBody(data) {
      const maxValue = Math.max(...Object.values(data));
      const scale = this.chartHeight / maxValue;

      const columnProps = Object.values(data).map(item => {
        return {
          percent: (item / maxValue * 100).toFixed(0) + '%',
          value: String(Math.floor(item * scale))
        };
      });

      this.subElements.body.innerHTML = columnProps.map(item => {
        return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`;
      })
      .join('');
    }

    getLink() {
      return this.link ?
        `<a class="column-chart__link" href="${this.link}">Подробнее</a>`
        : "";
    }

    async update(from, to) {
      this.element.classList.add('column-chart_loading');

      const data = await this.getServerData(from, to);

      if (Object.keys(data).length) {
        this.setColumnBody(data);
        this.setHeaderValue(data);

        this.element.classList.remove('column-chart_loading');
      }

      return data;
    }

    remove() {
      if (this.element) {
        this.element.remove();
      }
    }

    destroy() {
      this.remove();
      this.element = null;
      this.subElements = {};
    }
}
