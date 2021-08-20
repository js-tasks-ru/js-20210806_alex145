export default class ColumnChart {

  element = null;
  data = null;
  label = '';
  value = null;
  chartHeight = 50;
  formatHeading = function (data) {
    return data;
  };

  constructor(data = {}) {
    if (data.data && data.data.length) {
      this.data = data.data;
    }

    if (data.label && data.label.length) {
      this.label = data.label;
    }

    if (data.value) {
      this.value = data.value;
    }

    if (data.chartHeight) {
      this.chartHeight = data.chartHeight;
    }

    if (data.formatHeading) {
      this.formatHeading = data.formatHeading;
    }

    this.createChart();
  }

  update(data) {
    this.data = data;
    this.createChart();
  }

  createChart() {
    this.element = document.createElement('div');
    this.element.className = `column-chart ${this.data && this.data.length ? '' : 'column-chart_loading'}`;
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
               ${this.data && this.data.length ? this.createChartColumns() : ''}
          </div>
        </div>
    `;
  }

  createChartColumns() {
    const items = [];
    const maxValue = Math.max.apply(null, this.data);

    this.data.forEach(value => {
      items.push(`<div style="--value: ${Math.floor(50 / maxValue * value)}" data-tooltip="${Math.round(value / maxValue * 100)}%"></div>`);
    });
    return items.join('\n');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
  }

}
