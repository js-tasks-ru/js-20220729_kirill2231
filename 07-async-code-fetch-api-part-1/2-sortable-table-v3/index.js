import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  data = [];
  loading = false;
  step = 30;
  start = 0;
  end = 0;

  onSortClick = event => {
    event.preventDefault();

    const closestTarget = event.target.closest('[data-sortable]');

    if (closestTarget) {
      const order = closestTarget.dataset.order === 'asc' ? 'desc' : 'asc';
      const { id } = closestTarget.dataset;

      this.start = 0;
      this.end = 0;

      this.sorted = {
        id,
        order
      };

      if (this.isSortLocally) {
        this.sortOnClient({id, order});
      } else {
        this.sortOnServer({id, order});
      }
    }

  };

  onLoadingDataScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.element.classList.add('sortable-table_loading');

      this.loading = true;

      const sortedData = await this.getServerData(this.sorted);

      this.data = [...this.data, ...sortedData];

      this.loading = false;

      this.element.classList.remove('sortable-table_loading');

      const div = document.createElement('div');
      div.innerHTML = this.addRowsBodyTable(this.headerConfig, sortedData);

      this.subElements.body.append(...div.children);
    }
  };

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    document.addEventListener('scroll', this.onLoadingDataScroll);
  }

  constructor(headerConfig, {
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    url = '',
    isSortLocally = false,
    data = [],
    step = 30,
    start = 0,
    end = 0
  } = {}) {
    this.url = new URL(url, BACKEND_URL);
    this.data = data;
    this.headerConfig = headerConfig;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;

    this.render();
  }

  getTemplate() {
    return `
      <div class="sortable-table sortable-table_loading">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.addRowHeaderTable(this.headerConfig)}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.addRowsBodyTable(this.headerConfig, this.data)}
        </div>

        <div data-elem="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-elem="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>Нет данных</div>
        </div>
    </div>
        `;
  }

  render() {
    const {id, order} = this.sorted;

    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    if (this.isSortLocally) {
      this.sortOnClient({id, order});
    } else {
      this.sortOnServer({id, order});
    }

    this.initEventListeners();
  }

  async getServerData({id, order}) {
    this.url.searchParams.set('_embed', 'subcategory.category');
    this.url.searchParams.set('_sort', `${id}`);
    this.url.searchParams.set('_order', `${order}`);
    this.url.searchParams.set('_start', `${this.start = this.end}`);
    this.url.searchParams.set('_end', `${this.end += this.step}`);

    return await fetchJson(this.url);
  }

  addRowHeaderTable(config) {
    return config.map(elem => {
      return elem.sortable
        ? `
          <div class="sortable-table__cell" data-id="${elem.id}" data-sortable="${elem.sortable}">
            <span>${elem.title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
          </div>
        `
        : `
          <div class="sortable-table__cell" data-id="${elem.id}">
            <span>${elem.title}</span>
          </div>
        `;
    }).join('');
  }

  addCellsBodyTable(dataElem, config) {
    return config.map(configElem => {
      return configElem.template
        ? configElem.template(dataElem[configElem.id])
        : `<div class="sortable-table__cell">${dataElem[configElem.id]}</div>`;
    }).join('');
  }

  addRowsBodyTable(config, data) {
    return data.map(dataElem => {
      return `
        <a href="#" class="sortable-table__row">
          ${this.addCellsBodyTable(dataElem, config)}
        </a>
      `;
    }).join('');
  }

  moveSortArrow({id, order}) {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${id}"]`);

    allColumns.forEach(elem => {
      if (elem.dataset.sortable) {
        elem.dataset.order = '';
      }
    });

    currentColumn.dataset.order = order;
  }

  sortOnClient({id, order}) {
    const sortedData = this.sortData({id, order});

    this.moveSortArrow({id, order});

    this.subElements.body.innerHTML = this.addRowsBodyTable(this.headerConfig, sortedData);
  }

  async sortOnServer({id, order}) {
    const sortedData = await this.getServerData({id, order});

    if (sortedData.length) {
      this.moveSortArrow({id, order});
      this.subElements.body.innerHTML = this.addRowsBodyTable(this.headerConfig, sortedData);
      this.element.classList.remove('sortable-table_empty');
    } else {
      this.element.classList.add('sortable-table_empty');
    }
  }

  sortData({id, order}) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === id);
    const { sortType } = column;

    return arr.sort((a, b) => {
      const sortFactor = order === 'asc' ? 1 : -1;

      switch (sortType) {
      case 'number':
        return sortFactor * (a[id] - b[id]);
      case 'string':
        return sortFactor * a[id].localeCompare(b[id], ['ru', 'eng']);
      default:
        return sortFactor * (a[id] - b[id]);
      }
    });
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    elements.forEach(subElement => {
      const name = subElement.dataset.element;
      result[name] = subElement;
    });

    return result;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('scroll', this.onLoadingDataScroll);
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

