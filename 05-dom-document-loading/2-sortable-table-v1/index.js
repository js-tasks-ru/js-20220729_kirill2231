import {sortStrings} from '../../02-javascript-data-types/1-sort-strings/index.js';

export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">

        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.addCellTableHeader(this.headerConfig)}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.addCellTableBody(this.headerConfig, this.data)}
        </div>

        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
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

  addCellTableHeader(config) {
    return config.map(elem => {
      return `
        <div class="sortable-table__cell" data-id="${elem.id}" data-sortable="${elem.sortable}">
          <span>${elem.title}</span>
        </div>
      `;
    })
    .join('');
  }

  addCellTableBody(config, data) {
    const template = `<a href="#" class="sortable-table__row">`;

    return data.map(dataElem => {
      return template + config.map(configElem => {
        if (configElem.id === 'images') {
          return configElem.template(dataElem[configElem.id]);
        }

        return `
          <div class="sortable-table__cell">${dataElem[configElem.id]}</div>
        `;
      }).join('') + '</a>';
    })
    .join('');
  }

  sort(field, order) {
    const arr = this.element.querySelectorAll('.sortable-table__row');

    sortStrings(arr, 'asc');
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


