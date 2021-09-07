import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {

  element;
  subElements;
  data = [];

  constructor(headersConfig = [], {
    url = '',
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = false,
    step = 20,
    start = 1,
    end = start + step
  } = {}) {
    this.url = this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;
    this.headerConfig = headersConfig;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;

    this.render();
  }

  sortHandler = event => {
    const {id, order} = event.target.closest('.sortable-table__cell').dataset;
    if (this.sorted.id === id) {
      this.sorted.order = this.sorted.order === 'asc' ? 'desc' : 'asc';
    } else if (order === "") {
      this.sorted.order = 'desc';
    } else {
      this.sorted.order = order;
    }
    this.sorted.id = id;
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      this.sortOnServer(this.sorted.id, this.sorted.order);
    }
  };

  onWindowScroll = async () => {
    const {bottom} = this.element.getBoundingClientRect();
    const {id, order} = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      this.sorted.id = id;
      this.sorted.order = order;

      const data = await this.loadData();
      this.update(data);

      this.loading = false;
    }
  };

  addEventListeners() {
    this.element.querySelectorAll('.sortable-table__header .sortable-table__cell[data-sortable="true"]').forEach(item => {
      item.addEventListener('pointerdown', this.sortHandler);
    });
    document.addEventListener('scroll', this.onWindowScroll);
  }

  getArrow() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>`;
  }

  getTableHeader() {
    return `
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.headerConfig.map(item => this.getHeaderItem(item)).join('')}
        </div>
    `;
  }

  getHeaderItem({id, sortable, title}) {
    return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="">
          <span>${title}</span>
        </div>
    `;
  }

  getTableBody() {
    return `
        <div data-element="body" class="sortable-table__body">
            ${this.getTableRows(this.data)}
        </div>
    `;
  }

  getTableRows(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
            ${this.getTableRow(item)}
      </a>
      `;
    }).join('');
  }

  getTableRow(item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {id, template};
    });

    return cells.map(({id, template}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
       <div class="sortable-table">
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        ${this.getTableHeader()}
        ${this.getTableBody()}
       </div>
    `;
  }

  getSubElements(element) {
    const subElements = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      subElements[subElement.dataset.element] = subElement;
    }

    return subElements;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTable();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.addEventListeners();
    const data = await this.loadData();
    this.update(data);
  }

  async loadData() {

    this.element.classList.add('sortable-table_loading');

    this.url.searchParams.set('_sort', this.sorted.id);
    this.url.searchParams.set('_order', this.sorted.order);
    this.url.searchParams.set('_start', this.start + '');
    this.url.searchParams.set('_end', this.end + '');

    this.element.classList.remove('sortable-table_loading');

    const data = await fetchJson(this.url);
    return data;
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }

  remove() {
    if (this.element) {
      this.element.remove()
    }
  }

  sort(fieldValue, orderValue) {
    const data = [...this.data];
    const {sortType} = this.headerConfig.find(item => {
      return item.id === fieldValue;
    });
    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[orderValue];

    data.sort((a, b) => {
      if (sortType === 'string') {
        return direction * (a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en']));
      } else {
        return direction * (a[fieldValue] - b[fieldValue]);
      }
    });

    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id=${fieldValue}]`);

    const searchArrow = this.element.querySelector('.sortable-table__sort-arrow');
    if (searchArrow) {
      searchArrow.remove();
    }

    let arrow = document.createElement('div');
    arrow.innerHTML = this.getArrow();
    arrow = arrow.firstElementChild;

    allColumns.forEach(item => {
      item.dataset.order = '';
    });

    currentColumn.dataset.order = orderValue;
    currentColumn.append(arrow);

    this.subElements.body.innerHTML = this.getTableRows(data);
  }

  update(data) {
    const rows = document.createElement('div');

    this.data = [...this.data, ...data];
    rows.innerHTML = this.getTableRows(data);

    this.subElements.body.append(...rows.childNodes);
  }

  sortOnClient(fieldValue, orderValue) {
    this.sort(fieldValue, orderValue);
  }

  async sortOnServer() {
    this.start = 1;
    this.end = this.start + this.step;
    const data = await this.loadData();
    this.data = [];
    this.subElements.body.innerHTML = '';
    this.update(data);
  }
}

