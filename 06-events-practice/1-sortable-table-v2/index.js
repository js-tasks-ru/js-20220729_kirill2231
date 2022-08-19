export default class SortableTable {

  subElements = {};

  constructor(
    headerConfig = [],
    {data = [], sorted = {}}
    = {},
    isSortLocally = true) {

    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.render();
  }

  initialize () {
    const container = this.subElements.header;

    const pointerdown = new MouseEvent('pointerdown', {
      bubbles: true
    });

    container.addEventListener('pointerdown', (event) => {
      event.preventDefault();

      let order = event.target.dataset.order === 'asc' ? 'desc' : 'asc';
      let id = event.target.dataset.id;

      if (event.target.parentElement.dataset.sortable) {
        id = event.target.parentElement.dataset.id;
        order = event.target.parentElement.dataset.order === 'asc' ? 'desc' : 'asc';
      }

      if (event.target.parentElement.parentElement.dataset.sortable) {
        id = event.target.parentElement.parentElement.dataset.id;
        order = event.target.parentElement.parentElement.dataset.order === 'asc' ? 'desc' : 'asc';
      }

      if (!id) return;

      this.sort({id, order});
    });
  }

  getTemplate() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.addRowHeaderTable(this.headerConfig)}
        </div>

        <div data-element="body" id="" class="sortable-table__body">
          ${this.addRowsBodyTable(this.headerConfig, this.data)}
        </div>
    </div>
        `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    if (this.isSortLocally) {
      this.sort(this.sorted);
    }
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

  sort({id: field, order = 'asc'}) {
    const sortedData = this.sortData({field, order});
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach(elem => {
      if (elem.dataset.sortable) {
        elem.dataset.order = '';
      }
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.addRowsBodyTable(this.headerConfig, sortedData);
  }

  sortData({field, order}) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;

    return arr.sort((a, b) => {
      const sortFactor = order === 'asc' ? 1 : -1;

      switch (sortType) {
        case 'number':
          return sortFactor * (a[field] - b[field]);
        case 'string':
          return sortFactor * a[field].localeCompare(b[field], ['ru', 'eng']);
        default:
          return sortFactor * (a[field] - b[field]);
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
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
