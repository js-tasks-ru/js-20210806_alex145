export default class SortableTable {

  element;
  subElements;

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
    this.sort(this.sorted.id, this.sorted.order);
  };

  constructor(headerConfig = [], {data = [], sorted = {}} = {}) {
    this.sorted = sorted;
    this.headerConfig = headerConfig;
    this.data = data.data ? data.data : data;
    this.render();
    this.sort(this.sorted.id, this.sorted.order);
    this.addEventListeners();
  }

  addEventListeners() {
    this.element.querySelectorAll('.sortable-table__header .sortable-table__cell[data-sortable="true"]').forEach(item => {
      item.addEventListener('pointerdown', this.sortHandler);
    });
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

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTable();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
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
}
