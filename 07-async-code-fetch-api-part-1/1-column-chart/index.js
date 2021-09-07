import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

  element = {};
  subElements = {};
  chartHeight = 50;
  data = null;

  constructor(
    {
      label = '',
      link = '',
      formatHeading = data => data,
      url = '',
      range = {
        from: new Date(),
        to: new Date(),
      }
    } = {}) {
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading();
    this.url = new URL(url, BACKEND_URL);
    this.range = range;

    this.element = document.createElement('div');

    this.createChart();
    this.update();
  }

  async update(from = null, to = null) {
    from = from ?? this.range.from;
    to = to ?? this.range.to;

    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    this.data = await fetchJson(this.url);
    this.createChart();
    this.subElements = this.getSubElements(this.element);
    return this.data;
  }

  createChart() {
    this.element.className = `column-chart ${this.data ? '' : 'column-chart_loading'}`;
    this.element.style.cssText = `--chart-height: ${this.chartHeight}`;

    this.element.innerHTML = `
            <div class="column-chart__title">
            ${this.label}
            <a class="column-chart__link" href="#">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
          ${this.value ? this.formatHeading(this.value) : ''}
          </div>
          <div data-element="body" class="column-chart__chart">
               ${this.data ? this.createChartColumns() : ''}
          </div>
        </div>
    `;
  }

  createChartColumns() {
    const items = [];
    const maxValue = Math.max.apply(null, Object.values(this.data));

    Object.values(this.data).forEach(value => {
      items.push(`<div style="--value: ${Math.floor(50 / maxValue * value)}" data-tooltip="${Math.round(value / maxValue * 100)}%"></div>`);
    });
    return items.join('\n');
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }
}
