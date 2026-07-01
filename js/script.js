const widgetTypes = {
  converter: {
    label: 'Converter',
    src: 'https://wise.com/gb/currency-converter/fx-widget/converter?sourceCurrency=TRY&targetCurrency=EUR&amount=1000',
    width: 321,
    height: 380,
  },
  table: {
    label: 'Table',
    src: 'https://wise.com/gb/currency-converter/fx-widget/table?sourceCurrency=EUR&targetCurrencies=EUR%2CTRY%2CUSD%2CGBP%2CJPY%2CCNY%2CINR',
    width: 340,
    height: 500,
  },
  chart: {
    label: 'Chart',
    src: 'https://wise.com/gb/currency-converter/fx-widget/chart?sourceCurrency=TRY&targetCurrency=EUR',
    width: 370,
    height: 570,
  },
};

const container = document.querySelector('.container');
const panel = document.querySelector('#widget-panel');
const iframe = panel.querySelector('iframe');
const tabs = [...document.querySelectorAll('[data-widget-type]')];

function fitWidget() {
  const widget = widgetTypes[container.dataset.view];
  const horizontalGutter = 32;
  const availableWidth = Math.max(panel.clientWidth - horizontalGutter, 0);
  const scale = Math.min(1, availableWidth / widget.width);

  panel.style.setProperty('--widget-scale', String(scale));
  panel.style.setProperty('--widget-frame-height', `${Math.ceil(widget.height * scale)}px`);
}

function showWidget(type) {
  const widget = widgetTypes[type];

  if (!widget) {
    return;
  }

  container.dataset.view = type;
  iframe.title = `Wise FX ${widget.label}`;
  iframe.width = widget.width;
  iframe.height = widget.height;
  iframe.scrolling = 'no';

  if (iframe.src !== widget.src) {
    iframe.src = widget.src;
  }

  tabs.forEach((tab) => {
    const isActive = tab.dataset.widgetType === type;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  const activeTab = document.querySelector(`[data-widget-type="${type}"]`);
  panel.setAttribute('aria-labelledby', activeTab.id);
  fitWidget();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showWidget(tab.dataset.widgetType));

  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    showWidget(nextTab.dataset.widgetType);
    nextTab.focus();
  });
});

if ('ResizeObserver' in window) {
  const resizeObserver = new ResizeObserver(fitWidget);
  resizeObserver.observe(panel);
} else {
  window.addEventListener('resize', fitWidget);
}

iframe.addEventListener('load', fitWidget);
fitWidget();
